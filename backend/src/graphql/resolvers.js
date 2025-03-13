/**
 * Resolvers GraphQL pour l'API
 * Définit les fonctions qui résolvent les requêtes et mutations GraphQL
 */
const redis = require('../config/redis')  // Client Redis pour la mise en cache
const esClient = require('../utils/elasticsearchClient')  // Client Elasticsearch pour la recherche
const { Tweet } = require('../models/tweets')  // Modèle des tweets
const { generateAccessToken, verifyToken } = require('../utils/auth')  // Utilitaires d'authentification
const { generateTokens } = require('../services/tokenService')  // Service de gestion des tokens
const bcrypt = require('bcryptjs')  // Bibliothèque pour le hashage des mots de passe
const fs = require('fs')  // Module de gestion de fichiers
const path = require('path')  // Module de gestion des chemins
const mediaQueue = require('../queues/mediaQueue')  // File d'attente Bull pour les médias
const { wss } = require('../wsServer')  // Serveur WebSocket pour les communications en temps réel
const { GraphQLUpload } = require('graphql-upload')  // Middleware pour les uploads GraphQL
const { User } = require("../models/users")  // Modèle des utilisateurs
const { handleUpload } = require('../utils/graphUpload')  // Utilitaire de gestion des uploads
const { Comment } = require('../models/comments')  // Modèle des commentaires
const { notificationQueue } = require("../queues/notificationQueue")  // File d'attente pour les notifications
const { sendNotification } = require('../wsServer')  // Fonction d'envoi de notifications
const { Like } = require('../models/likes')  // Modèle des likes

/**
 * Définition des resolvers GraphQL
 * @typedef {Object} Resolvers
 */
const resolvers = {
  // Exposition du scalar Upload pour gérer les fichiers
  Upload: GraphQLUpload,

  /**
   * Requêtes GraphQL
   * @type {Object}
   */
  Query: {
    /**
     * Récupère le fil d'activité d'un utilisateur
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} __ - Arguments (non utilisés)
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Timeline personnalisée de l'utilisateur
     */
    userTimeline: async (_, __, { req }) => {
      // Vérification de l'authentification
      const user = await verifyToken(req)
      if (!user) throw new Error("Authentification requise")

      try {
        // Récupération de l'utilisateur authentifié avec ses bookmarks
        const authenticatedUser = await User.findById(user.id)
          .populate("bookmarks") // Peuplement des tweets en favoris
          .exec();
    
        if (!authenticatedUser) {
          throw new Error("User not found");
        }
        
        // Récupération des informations de l'utilisateur depuis la base de données
        const userData = await User.findById(user.id)

        if (!userData) {
          throw new Error("Utilisateur introuvable");
        }
        
        // Récupération des tweets créés par l'utilisateur
        const tweets = await Tweet.find({ author: user.id })
          .populate("author", "username profile_img") // Peuplement des détails de l'auteur
          .populate("comments") // Peuplement des commentaires
          .exec();
    
        // Récupération des commentaires créés par l'utilisateur
        const comments = await Comment.find({ author: user.id })
          .populate("tweet", "content author") // Inclusion des détails du tweet
          .exec();
    
        // Récupération des tweets likés par l'utilisateur
        const likedTweets = await Tweet.find({ likes: user.id })
          .populate("author", "username profile_img")
          .exec();
    
        // Retour de l'ensemble des données
        return {
          user: userData,
          tweets,
          comments,
          likedTweets,
          bookmarks: authenticatedUser.bookmarks, // Bookmarks déjà peuplés
        };
      } catch (error) {
        console.error("Error fetching user timeline:", error);
        throw new Error("Internal Server Error");
      }
    },
    
    /**
     * Récupère le fil d'actualité personnalisé
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} __ - Arguments (non utilisés)
     * @param {Object} context - Contexte de la requête
     * @returns {Array} Tweets du fil d'actualité
     */
    getTimeline: async (_, __, { req }) => {
      // Vérification de l'authentification
      const currentUser = await verifyToken(req);
      if (!currentUser) throw new Error("Authentification requise");
      
      // Tentative de récupération du timeline depuis le cache Redis
      const cacheKey = `timeline:${currentUser.id}`;
      const cachedTimeline = await redis.get(cacheKey);
    
      // Si disponible dans le cache, retourne les données mises en cache
      if (cachedTimeline) {
        console.log("Serving from Redis cache");
        return JSON.parse(cachedTimeline);
      }
    
      // Récupération de l'utilisateur avec ses abonnements et favoris
      const user = await User.findById(currentUser.id).select("followings bookmarks");
      if (!user) throw new Error("Utilisateur introuvable");
    
      // Récupération des tweets des abonnements
      const followedTweets = await Tweet.find({ author: { $in: user.followings } })
        .populate("author", "username handle profile_img")
        .sort({ createdAt: -1 })
        .limit(50);
    
      // Récupération des tweets likés et retweetés
      const likedAndRetweetedTweets = await Like.find({ user: currentUser.id })
        .populate({
          path: "tweet",
          populate: { path: "author", select: "username handle profile_img" },
        })
        .sort({ createdAt: -1 })
        .limit(50);
    
      // Récupération des tweets avec les hashtags populaires
      const trendingHashtags = await Tweet.aggregate([
        { $unwind: "$hashtags" },
        { $group: { _id: "$hashtags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);
    
      const tweetsWithTrendingHashtags = await Tweet.find({
        hashtags: { $in: trendingHashtags.map((tag) => tag._id) },
      })
        .populate("author", "username handle profile_img")
        .sort({ engagementScore: -1 })
        .limit(50);
      
      // Récupération des tweets de l'utilisateur lui-même
      const ownTweets = await Tweet.find({ author: currentUser.id })
        .populate("author", "username handle profile_img")
        .sort({ createdAt: -1 })
        .limit(50);
        
      // Fusion et tri des tweets
      const timelineTweets = [
        ...ownTweets, // Inclusion des tweets de l'utilisateur
        ...followedTweets,
        ...likedAndRetweetedTweets.map((like) => like.tweet),
        ...tweetsWithTrendingHashtags,
      ];
    
      // Élimination des doublons
      const uniqueTweets = Array.from(
        new Map(
          timelineTweets
            .filter(tweet => tweet && tweet._id) // Évitement des valeurs nulles
            .map((tweet) => [tweet._id.toString(), tweet])
        ).values()
      );
    
      // Vérification des retweets de l'utilisateur
      const retweetedIds = await Tweet.find({
        author: currentUser.id,
        isRetweet: true,
        originalTweet: { $in: uniqueTweets.map((tweet) => tweet._id.toString()) },
      }).distinct("originalTweet");
    
      // Formatage des tweets pour l'affichage
      const finalTweets = uniqueTweets.map((tweet) => ({
        id: tweet._id,
        content: tweet.content,
        media: tweet.media,
        createdAt: tweet.createdAt,
        likes: Array.isArray(tweet.likes) ? tweet.likes.length : 0,
        retweets: Array.isArray(tweet.retweets) ? tweet.retweets.length : 0,
        isRetweet: tweet.isRetweet,
        isLiked: Array.isArray(tweet.likes) && tweet.likes.some((like) => like.toString() === currentUser.id),
        isRetweeted: retweetedIds.some(id => id.toString() === tweet._id.toString()),
        isFollowing: user.followings.includes(tweet.author._id.toString()),
        author: {
          id: tweet.author._id,
          username: tweet.author.username,
          handle: tweet.author.handle,
          profile_img: tweet.author.profile_img,
        },
        comments: tweet.comments,
      })).sort((a, b) => b.likes + b.retweets - (a.likes + a.retweets));
    
      // Mise en cache du résultat dans Redis (20 secondes)
      await redis.setex(cacheKey, 20, JSON.stringify(finalTweets));
      return finalTweets;
    },
    
    /**
     * Récupère les tweets d'un utilisateur spécifique
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la requête
     * @returns {Array} Tweets de l'utilisateur
     */
    getUserTweets: async(_, { userId }) => {
      try {
        const tweets = await Tweet.find({ author: userId }).populate("author");
        return tweets;
      } catch (error) {
        throw new Error("Erreur lors de la récupération des tweets.");
      }
    },
    
    /**
     * Récupère un tweet spécifique par son ID
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la requête
     * @returns {Object} Tweet demandé
     */
    getTweet: async (_, { id }) => {
      // Tentative de récupération depuis le cache Redis
      const cachedTweet = await redis.get(`tweet:${id}`);
      if (cachedTweet) {
        console.log("🟢 Récupéré depuis Redis");
        return JSON.parse(cachedTweet);
      }
    
      // Récupération depuis MongoDB avec peuplement des relations
      const tweet = await Tweet.findById(id)
        .populate("author", "username handle profile_img")
        .populate({
          path: "comments",
          populate: { path: "author", select: "username handle profile_img" }
        });
    
      if (!tweet) throw new Error("Tweet non trouvé");
    
      // Mise en cache dans Redis (10 minutes)
      await redis.set(`tweet:${id}`, JSON.stringify(tweet), "EX", 600);
    
      console.log("🔴 Récupéré depuis MongoDB");
      return tweet;
    },

    /**
     * Recherche des tweets par contenu
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la requête
     * @returns {Array} Tweets correspondants à la recherche
     */
    searchTweets: async (_, { query }) => {
      // Tentative de récupération depuis le cache Redis
      const cachedResults = await redis.get(`search:${query}`)
      if (cachedResults) {
        console.log("🟢 Résultats récupérés depuis Redis")
        return JSON.parse(cachedResults);
      }

      // Recherche via Elasticsearch
      const { hits } = await esClient.search({
        index: "tweets",
        body: { query: { match: { content: query } } },
      })

      // Extraction des résultats
      const results = hits.hits.map((hit) => hit._source);
      
      // Mise en cache dans Redis (5 minutes)
      await redis.set(`search:${query}`, JSON.stringify(results), "EX", 300)
      return results
    },

    /**
     * Récupère l'utilisateur actuellement authentifié
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} __ - Arguments (non utilisés)
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Utilisateur authentifié
     */
    getCurrentUser: async (_, __, { req }) => {
        const user = await verifyToken(req)
        if (!user) throw new Error("Non authentifié");
        return user;
    },
  },

  /**
   * Mutations GraphQL
   * @type {Object}
   */
  Mutation: {
    /**
     * Gère le suivi/arrêt de suivi d'un autre utilisateur
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Statut du suivi et nombre de followers
     */
    follow: async (_, { userId }, { req }) => {
      // Vérification de l'authentification
      const currentUser = await verifyToken(req);
      if (!currentUser) throw new Error("Authentification requise")
    
      // Vérification que l'utilisateur ne tente pas de se suivre lui-même
      if (currentUser.id === userId) {
        throw new Error("Vous ne pouvez pas vous suivre vous-même.");
      }
    
      // Récupération des deux utilisateurs
      const user = await User.findById(currentUser.id);
      const targetUser = await User.findById(userId);
    
      if (!targetUser) {
        throw new Error("Utilisateur introuvable.");
      }
    
      // Vérification si l'utilisateur suit déjà la cible
      const alreadyFollowing = user.followings.includes(userId);
    
      if (alreadyFollowing) {
        // Arrêt du suivi : retrait de la liste
        user.followings = user.followings.filter(id => id.toString() !== userId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser.id);
      } else {
        // Suivi : ajout à la liste
        user.followings.push(userId);
        targetUser.followers.push(currentUser.id);
    
        // Ajout d'une notification pour l'utilisateur suivi
        await notificationQueue.add({
          recipientId: targetUser._id.toString(),
          message: `${user.username} vous suit maintenant!`,
        });
      }
    
      // Sauvegarde des modifications
      await user.save();
      await targetUser.save();
    
      return {
        success: true,
        following: !alreadyFollowing,
        followersCount: targetUser.followers.length
      };
    },
    
    /**
     * Gère l'ajout/suppression d'un tweet aux favoris (bookmarks)
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Utilisateur mis à jour
     */
    bookmarkTweet: async (_, { tweetId }, { req }) => {
      // Vérification de l'authentification
      const user = await verifyToken(req);
      if (!user) throw new Error("Authentification requise");
    
      // Vérification que le tweet existe
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) throw new Error("Tweet non trouvé");
    
      // Vérification si le tweet est déjà enregistré
      const isBookmarked = user.bookmarks.includes(tweetId);
      if (isBookmarked) {
        // Suppression du bookmark si déjà présent
        user.bookmarks = user.bookmarks.filter(id => id.toString() !== tweetId);
      } else {
        // Ajout du bookmark
        user.bookmarks.push(tweetId);
      }
    
      // Sauvegarde des modifications
      await user.save();
      return user;
    },
    
    /**
     * Gère le retweet d'un tweet
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Statut du retweet et tweet retweeté
     */
    reTweet: async (_, { tweetId }, { req }) => {
      try {
        // Vérification de l'authentification
        const user = await verifyToken(req)
        if (!user) throw new Error("Requiert authentification")
        
        // Vérification que le tweet existe
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) throw new Error("Tweet non trouvé")
    
        // Vérification si l'utilisateur a déjà retweeté ce tweet
        const existingRetweet = await Tweet.findOne({
          originalTweet: tweetId,
          author: user.id,
          isRetweet: true,
        });
    
        if (existingRetweet) {
          // Suppression du retweet existant
          await Tweet.findByIdAndDelete(existingRetweet._id);
          
          // Retrait de l'ID du retweet de la liste des retweets du tweet original
          await Tweet.findByIdAndUpdate(tweetId, {
            $pull: { retweets: existingRetweet._id }
          });
    
          return {
            success: true,
            message: "Retweet supprimé",
            tweet: null
          };
        }
    
        // Création d'un nouveau retweet
        const reTweet = new Tweet({
          content: tweet.content,
          media: tweet.media,
          author: user.id,
          originalTweet: tweet._id,
          isRetweet: true,
          mentions: tweet.mentions,
          likes: [],
          comments: [],
          retweets: [],
          hashtags: tweet.hashtags,
        });
    
        // Sauvegarde du retweet
        await reTweet.save();
    
        // Ajout de l'ID du retweet au tweet original
        tweet.retweets.push(reTweet._id);
        await tweet.save();
    
        return {
          success: true,
          message: "Retweet ajouté",
          tweet: reTweet
        };
      } catch (error) {
        console.error("Erreur dans reTweet:", error);
        return {
          success: false,
          message: "Erreur interne du serveur",
          tweet: null
        };
      }
    },
    
    /**
     * Gère le like d'un tweet
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Statut du like et tweet liké
     */
    async likeTweet(_, { tweetId }, { req }) {
      // Vérification de l'authentification
      const user = await verifyToken(req)
      if (!user) throw new Error("Requiert authentification")
      
      // Vérification que le tweet existe
      const tweet = await Tweet.findById(tweetId)
      if (!tweet) throw new Error("Tweet not found")
      
      const userId = user.id.toString()

      // Vérification si l'utilisateur a déjà liké ce tweet
      const existingLike = await Like.findOne({ user: userId, tweet: tweetId })
      const alreadyLiked = tweet.likes.includes(userId)

      if (existingLike) {
         // Si déjà liké, retirer le like
          await Like.deleteOne({ _id: existingLike._id })
          tweet.likes = tweet.likes.filter(id => id.toString() !== userId)
          await tweet.save()
          return { success: true, liked: false, likes: tweet.likes.length }
      } 
      
      // Ajout du like
      const newLike = new Like({ user: userId, tweet: tweetId })
      await newLike.save()

      tweet.likes.push(userId)
      await tweet.save()
      
      // Envoi d'une notification à l'auteur du tweet
      await sendNotification(tweet.author.toString(), `${user.username} a liké votre tweet!`)
    
      // Retour du statut et du tweet
      return {
        success: true,
        liked: !alreadyLiked,
        likes: tweet.likes.length,
        tweet: await Tweet.findById(tweetId).populate("author likes"),
      }
    },
    
    /**
     * Gère l'inscription d'un nouvel utilisateur
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @returns {Object} Utilisateur créé avec son token
     */
    register: async (_, { username, email, password }) => {
        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Création du nouvel utilisateur
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
  
        // Génération du token d'authentification
        const token = generateAccessToken(user);
        return { ...user._doc, id: user._id, token };
    },

    /**
     * Gère la connexion d'un utilisateur
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @returns {Object} Utilisateur authentifié avec son token
     */
    login: async (_, { email, password }) => {
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email })
        if (!user) throw new Error("Utilisateur non trouvé")
  
        // Vérification du mot de passe
        const match = await bcrypt.compare(password, user.password)
        if (!match) throw new Error("Mot de passe incorrect")
  
        // Génération du token d'authentification
        const { accessToken: token } = await generateTokens(user)
        
        // Stockage du token dans Redis
        redis.set(`token_${user._id}`, token, 'EX', 7200)
        return { ...user._doc, id: user._id, token }
    },

    /**
     * Gère la déconnexion d'un utilisateur
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} __ - Arguments (non utilisés)
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Confirmation de la déconnexion
     */
    logout: async (_, __, { req }) => {
      try {
        // Récupération du token
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return { success: false, message: "Aucun token fourni." };
        }

        // Ajout du token à la liste noire avec une expiration (7 jours)
        await redis.setex(`blacklist:${token}`, 604800, "invalid"); // 604800 sec = 7 jours

        return { success: true, message: "Déconnexion réussie." };
      } catch (error) {
        console.error("Erreur lors du logout:", error);
        return { success: false, message: "Erreur serveur." };
      }
    },
    
    /**
     * Crée un nouveau tweet
     * @async
     * @param {Object} _ - Argument parent (non utilisé)
     * @param {Object} args - Arguments de la mutation
     * @param {Object} context - Contexte de la requête
     * @returns {Object} Tweet créé
     */
    createTweet: async (_, { content, media, mentions, hashtags }, { req }) => {
      // Vérification de l'authentification
      const user = await verifyToken(req)
      if (!user) throw new Error("Non authentifié");
      console.log("Utilisateur authentifié:", user.id);
      console.log("Content reçu:", content);
    
      // Validation du contenu
      if (!content || content.trim() === "") {
        throw new Error("Le contenu du tweet ne peut pas être vide.");
      }
      
      let mediaUrl = null;

      // Traitement du média si fourni
      if (media) {
        mediaUrl = await handleUpload(media)
        // Ajout du média à la file d'attente pour traitement asynchrone
        await mediaQueue.add({ filePath: mediaUrl });
      }

      // Conversion des hashtags en minuscules (si présents)
      const tweetHashtags = hashtags ? hashtags.map(tag => tag.toLowerCase()) : [];

      // Création du tweet
      const tweet = new Tweet({
        content,
        media: mediaUrl,
        author: user.id,
        mentions,
        hashtags: tweetHashtags,
      });
      await tweet.save();

      // Notification via WebSocket à tous les clients connectés
      const payload = JSON.stringify({
        type: "NEW_TWEET",
        tweetId: tweet._id,
        content: tweet.content,
        author: user.id,
      });
      wss.clients.forEach(client => client.send(payload))
      
      // Invalidation du cache pour le timeline
      await redis.del(`timeline:${user.id}`);

      return tweet;
    },
  },
}

// Export des resolvers pour utilisation dans la configuration Apollo Server
module.exports = resolvers