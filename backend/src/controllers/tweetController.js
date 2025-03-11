const notificationQueue = require('../src/queues/notificationQueue')
const { Tweet, tweetValidation } = require('../src/models/tweets')
const redis = require('../src/utils/redisClient')
const { wss } = require('../src/wsServer')
const mediaQueue = require('../src/queues/mediaQueue')

class tweetController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async creatTweet (req, res) {
        try {
            const { content, mentions, hashtags } = req.body;
            const author = req.user.id; // ID de l'utilisateur authentifié
            let mediaUrl = null;
        
            if (req.file) {
              mediaUrl = `/uploads/${req.file.filename}`;
        
              // Ajouter le média à la file d’attente Bull
              await mediaQueue.add({ filePath: mediaUrl });
            }
        
            const tweet = new Tweet({
              content,
              media: mediaUrl,
              author,
              mentions,
              hashtags: hashtags ? hashtags.map((tag) => tag.toLowerCase()) : [],
            });
        
            await tweet.save();
        
            // Notification WebSocket pour les abonnés
            const payload = JSON.stringify({
              type: "NEW_TWEET",
              tweetId: tweet._id,
              content: tweet.content,
              author: author,
            });
        
            wss.clients.forEach((client) => client.send(payload));
        
            res.status(201).json(tweet);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la création du tweet" });
          }
    }

    static async likeTweet (req, res) {
        const { tweetId, userId } = req.body;
        const tweet = await Tweet.findById(tweetId);

        if (!tweet.likes.includes(userId)) {
            tweet.likes.push(userId);
            await tweet.save();

            // Ajouter une notification dans la file Bull
            notificationQueue.add({
            recipientId: tweet.author.toString(),
            message: "Votre tweet a été liké !",
            });
        }

        res.json(tweet);
    }

    static async getHomeTimeline (req, res) {

    }
}

module.export = tweetController