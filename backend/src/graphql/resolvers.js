const redis = require('../config/redis')
const esClient = require('../utils/elasticsearchClient')
const { Tweet } = require('../models/tweets')
const { generateAccessToken, verifyToken } = require('../utils/auth')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
const mediaQueue = require('../queues/mediaQueue') // File d'attente Bull pour les médias
const { wss } = require('../wsServer'); // Serveur WebSocket
const { GraphQLUpload } = require('graphql-upload')
const { User } = require("../models/users")
const { handleUpload } = require('../utils/graphUpload')

const resolvers = {
  // On expose le scalar Upload
  Upload: GraphQLUpload,

  Query: {
    getUserTweets: async(_, { userId }) => {
      try {
        const tweets = await Tweet.find({ author: userId }).populate("author");
        return tweets;
      } catch (error) {
        throw new Error("Erreur lors de la récupération des tweets.");
      }
    },
    getTimeline: async (_, __, { req }) => {
      // Vérifie l’authentification
      const user = await verifyToken(req);
      if (!user) throw new Error("Non authentifié");
      // console.log(user)
      // Récupérer les tweets les plus récents
      const tweets = await Tweet.find().sort({ createdAt: -1 })
      .populate("author", "_id username");

      console.log(tweets)
      return tweets
    },
    getTweet: async (_, { id }) => {
      // Vérifier si le tweet est en cache
      const cachedTweet = await redis.get(`tweet:${id}`)
      if (cachedTweet) {
        console.log("🟢 Récupéré depuis Redis")
        return JSON.parse(cachedTweet);
      }

      // Sinon, récupérer depuis MongoDB
      const tweet = await Tweet.findById(id).populate("author")
      if (!tweet) throw new Error("Tweet non trouvé")

      // Mettre en cache avec expiration
      await redis.set(`tweet:${id}`, JSON.stringify(tweet), "EX", 600)

      console.log("🔴 Récupéré depuis MongoDB");
      return tweet
    },

    searchTweets: async (_, { query }) => {
      const cachedResults = await redis.get(`search:${query}`)
      if (cachedResults) {
        console.log("🟢 Résultats récupérés depuis Redis")
        return JSON.parse(cachedResults);
      }

      const { hits } = await esClient.search({
        index: "tweets",
        body: { query: { match: { content: query } } },
      })

      const results = hits.hits.map((hit) => hit._source);
      await redis.set(`search:${query}`, JSON.stringify(results), "EX", 300)
      return results
    },

    getCurrentUser: async (_, __, { req }) => {
        const user = await verifyToken(req);
        if (!user) throw new Error("Non authentifié");
        return user;
    },
    // getUserTweets(userId: ID!): [Tweet!]!
  },
  //PERMET DE RECUP TOUS LES TWEETS ASSOCIES QUAND ON QUERY UN USER
  User: {
    async tweets(parent) {
      return await Tweet.find({ author: parent.id });
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
  
        const token = generateAccessToken(user);
        return { ...user._doc, id: user._id, token };
    },

    login: async (_, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Utilisateur non trouvé");
  
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Mot de passe incorrect");
  
        const token = generateAccessToken(user);
        redis.set(`token_${user._id}`, token, 'EX', 7200);
        return { ...user._doc, id: user._id, token };
    },

    logout: async (_, __, { req }) => {
      try {
        const token = req.headers.authorization?.split(" ")[1]; // Récupérer le token
        if (!token) {
          return { success: false, message: "Aucun token fourni." };
        }

        // Ajouter le token à la liste noire avec une expiration (ex: 7 jours)
        await redis.setex(`blacklist:${token}`, 604800, "invalid"); // 604800 sec = 7 jours

        return { success: true, message: "Déconnexion réussie." };
      } catch (error) {
        console.error("Erreur lors du logout:", error);
        return { success: false, message: "Erreur serveur." };
      }
    },

    // createTweetOld: async (_, { content }, context) => {
    //     const user = await verifyToken(context.req)
    //     if (!user) throw new Error("Non authentifié")

    //     const tweet = new Tweet({ content, author: user.id })
    //     await tweet.save()

    //     await esClient.index({
    //         index: "tweets",
    //         id: tweet._id.toString(),
    //         body: { content, author: tweet.author },
    //     })

    //     await redis.keys("search:*").then((keys) => {
    //         if (keys.length) redis.del(...keys)
    //     })

    //     return tweet
    // },
    createTweet: async (_, { content, media, mentions, hashtags }, { req }) => {
      // Vérifier l'authentification (le middleware doit ajouter req.user)
      // Vérifie l'authentification
      const user = await verifyToken(req)
      if (!user) throw new Error("Non authentifié");
      console.log("Utilisateur authentifié:", user.id);
      console.log("Content reçu:", content);
    
      if (!content || content.trim() === "") {
        throw new Error("Le contenu du tweet ne peut pas être vide.");
      }
      let mediaUrl = null;

      // Si un fichier média est fourni, le traiter
      if (media) {
        mediaUrl = await handleUpload(media)
        // Ajouter le média à la file d'attente pour traitement asynchrone
        await mediaQueue.add({ filePath: mediaUrl });
      }

      // Convertir les hashtags en minuscules (si présents)
      const tweetHashtags = hashtags ? hashtags.map(tag => tag.toLowerCase()) : [];

      // Créer le tweet dans la base
      const tweet = new Tweet({
        content,
        media: mediaUrl,
        author: user.id,
        mentions,
        hashtags: tweetHashtags,
      });
      await tweet.save();

      // Envoyer une notification via WebSocket à tous les clients connectés
      const payload = JSON.stringify({
        type: "NEW_TWEET",
        tweetId: tweet._id,
        content: tweet.content,
        author: user.id,
      });
      wss.clients.forEach(client => client.send(payload));

      return tweet;
    },
  },
}

module.exports = resolvers
