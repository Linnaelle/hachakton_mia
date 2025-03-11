const notificationQueue = require('../queues/notificationQueue')
const { Tweet, tweetValidation } = require('../models/tweets')
const redis = require('../config/redis')
const { wss } = require('../wsServer')
const mediaQueue = require('../queues/mediaQueue')
const ObjectId = require('mongoose').Types.ObjectId
const { Comment, commentValidation } = require('../models/comments')

class tweetController {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async createTweet (req, res) {
        try {
            // Convertir hashtags en tableau s'il est envoyé sous forme de chaîne
            req.body.hashtags = Array.isArray(req.body.hashtags)
            ? req.body.hashtags
            : req.body.hashtags
            ? req.body.hashtags.split(',').map(tag => tag.trim())
            : []
            const { error, value } = tweetValidation.validate(req.body)
            if (error) {
              return res.status(400).json({ message: error.details[0].message })
            }
            console.log(value)
            const { content, mentions, hashtags } = req.body;
            console.log(req.user)
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
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async getHomeTimeline (req, res) {

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */

    static async getAllTweets (req, res) {
      const tweets = await Tweet.find()
      res.status(200).json(tweets);
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    static async deleteTweet(req, res) {
      // res.json({ msg: "del"})
      const id = req.params.id.trim()
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      try {
        // check tweet exist
          let tweet = await Tweet.findById(id)
          if (!tweet){
              return res.status(404).json({message: `Aucun tweet associé à l'id ${id}`})
          }
          // verifier que user est bien l'auteur du tweet
          const user_id = req.user.id
          if (user_id != tweet.author) {
            return res.status(400).json({ message: "Vous n'etes pas autorise a supprimer ce tweet"})
          }
          // Delete the associated image file if it exists
          if (tweet.media) {
            const imagePath = path.join(__dirname, '..', 'uploads', path.basename(tweet.media));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
          }

          tweet = await Tweet.deleteOne({_id: id})
          res.status(200).json({ message: 'Tweet deleted successfully' }); 
      } catch(error) {
          console.error('Error fetching tweet:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
    }

    static async comment(req, res) {
      // res.json({ msg: "del"})
      const id = req.params.id.trim()
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      try {
        // check tweet exist
          let tweet = await Tweet.findById(id)
          if (!tweet){
              return res.status(404).json({message: `Aucun tweet associé à l'id ${id}`})
          }
          const { error, value } = commentValidation.validate(req.body)

          if (error) {
            return res.json({ message: error.details[0].message})
          }

          // recup l'id de l'auteur du commentaire
          const author = req.user.id
          const newComment = new Comment({
            content: req.body.content,
            author,
            tweet: id
          })

          await newComment.save()
          return res.status(200).json(newComment)
          
      } catch(error) {
          console.error('Error fetching tweet:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
    }

     /**
     * 
     * @param {*} req 
     * @param {*} res 
     */

     static async getTweet (req, res) {
      const tweets = await Tweet.find()
      res.status(200).json(tweets);
    }
}

module.exports = tweetController