const { User, userValidation } = require("../models/users")
const { Tweet } = require('../models/tweets')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcryptjs')

class userController {
    /**
     * obtenir la liste de tous les utilisateurs
     * @param {*} req 
     * @param {*} res 
     */
    static async getAll(req, res) {
            // console.log("before request")
            const users = await User.find()
            console.log(users)

            res.status(200).json(users).send()
    }

    /**
     * obtenir les infos sur le profile
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */

    static async getMe(req, res) {
        const id = req.params.id.trim()
        console.log(id)
        if (!ObjectId.isValid(id)) {
            return res.status(401).send("Id invalide")
        }
        const user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        console.log(user)

        res.status(200).json(user).send()
    }
    /**
     * creer un utilisateur
     * @param {*} req 
     * @param {*} res 
     */
    static async signUp(req, res) {
        try {
            console.log(req.body)
            const { error, value } = userValidation.validate(req.body)
            if (error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ message: "User already exist" })
            }
             // Hachage du mot de passe avec bcrypt (10 rounds de sel)
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

            // Gerer image upload
            const profile_img = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                profile_img })
            await newUser.save()
            res.status(201).send(newUser)

        } catch(error) {
            console.error('Error signing up:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    }

    static async bookmarkTweet(req, res) {
        try {
          const userId = req.user.id;
          const { tweetId } = req.params;
      
          // Vérifier si le tweet existe
          const tweet = await Tweet.findById(tweetId);
          if (!tweet) return res.status(404).json({ error: "Tweet non trouvé" });
      
          // Récupérer l'utilisateur
          const user = await User.findById(userId);
      
          // Vérifier si le tweet est déjà enregistré
          const isBookmarked = user.bookmarks.includes(tweetId);
          if (isBookmarked) {
            user.bookmarks = user.bookmarks.filter(id => id.toString() !== tweetId);
          } else {
            user.bookmarks.push(tweetId);
          }
      
          await user.save();
          res.json({ success: true, bookmarks: user.bookmarks });
      
        } catch (error) {
          console.error("Erreur Signet:", error);
          res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async follow(req, res) {

    }

    static async userTimeline(req, res) {
        
    }
}

module.exports = userController