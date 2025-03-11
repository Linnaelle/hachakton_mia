const redis = require('../utils/redisClient')
const esClient = require('../utils/elasticsearchClient')
const { Tweet } = require('../models/tweets')
const { generateAccessToken, verifyToken } = require('../utils/auth')
const bcrypt = require('bcryptjs')
const { User } = require('../models/users')

const resolvers = {
  Query: {
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

    createTweet: async (_, { content }, context) => {
        const user = await verifyToken(context.req)
        if (!user) throw new Error("Non authentifié")

        const tweet = new Tweet({ content, author: user.id })
        await tweet.save()

        await esClient.index({
            index: "tweets",
            id: tweet._id.toString(),
            body: { content, author: tweet.author },
        })

        await redis.keys("search:*").then((keys) => {
            if (keys.length) redis.del(...keys)
        })

        return tweet
    },
  },
}

module.exports = resolvers
