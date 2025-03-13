/**
 * Contrôleur pour la gestion des utilisateurs
 * Gère les opérations liées aux utilisateurs comme l'inscription, le profil, les abonnements
 */
const { User, userValidation } = require("../models/users")  // Modèle et validation des utilisateurs
const { Tweet } = require('../models/tweets')  // Modèle des tweets
const ObjectId = require('mongoose').Types.ObjectId  // Utilitaire pour valider les IDs MongoDB
const bcrypt = require('bcryptjs')  // Bibliothèque pour le hashage des mots de passe
const { addNotificationToQueue } = require('../queues/notificationQueue')  // File d'attente pour les notifications

/**
 * Classe contrôleur avec méthodes statiques pour gérer les utilisateurs
 */
class userController {
    /**
     * Récupère la liste de tous les utilisateurs
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} Liste de tous les utilisateurs
     */
    static async getAll(req, res) {
            // console.log("before request")
            const users = await User.find()
            console.log(users)

            res.status(200).json(users).send()
    }

    /**
     * Récupère les informations du profil d'un utilisateur spécifique
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} Informations de l'utilisateur demandé
     */
    static async getMe(req, res) {
        const id = req.params.id.trim()
        console.log(id)
        // Validation de l'ID
        if (!ObjectId.isValid(id)) {
            return res.status(401).send("Id invalide")
        }
        // Recherche de l'utilisateur
        const user = await User.findOne({ _id: id })
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        console.log(user)

        res.status(200).json(user).send()
    }
    
    /**
     * Gère l'inscription d'un nouvel utilisateur
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} L'utilisateur créé
     */
    static async signUp(req, res) {
        try {
            console.log(req.body)
            // Validation des données d'entrée
            const { error, value } = userValidation.validate(req.body)
            if (error) {
                return res.status(400).json({ message: error.details[0].message})
            }
            
            // Vérification si l'email existe déjà
            let user = await User.findOne({ email: req.body.email })
            if (user) {
                return res.status(400).json({ message: "Email already used" })
            }
            
            // Vérification si le nom d'utilisateur existe déjà
            user = await User.findOne({ username: req.body.username })
            if (user) {
                return res.status(400).json({ message: "Username already used" })
            }
            
            // Hashage du mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

            // Gestion de l'image de profil
            const profile_img = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null
            
            // Génération d'un handle unique
            let baseHandle = req.body.username.toLowerCase().replace(/\s+/g, '_'); // Conversion en minuscule et remplacement des espaces
            let uniqueHandle = baseHandle;
            let count = 1;

            // Vérification de l'unicité du handle
            while (await User.findOne({ handle: uniqueHandle })) {
                uniqueHandle = `${baseHandle}${count++}`;
            }
            
            // Création du nouvel utilisateur
            const newUser = new User({
              username: req.body.username,
              email: req.body.email,
              password: hashedPassword,
              profile_img,
              handle: uniqueHandle // Attribution du handle généré
            });
            
            // Sauvegarde de l'utilisateur dans la base de données
            await newUser.save()
            res.status(201).send(newUser)

        } catch(error) {
            console.error('Error signing up:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Gère l'ajout/suppression d'un tweet aux favoris (bookmarks)
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} Liste mise à jour des bookmarks
     */
    static async bookmarkTweet(req, res) {
        try {
          const userId = req.user.id;
          const { tweetId } = req.params;
      
          // Vérification que le tweet existe
          const tweet = await Tweet.findById(tweetId);
          if (!tweet) return res.status(404).json({ error: "Tweet non trouvé" });
      
          // Récupération de l'utilisateur
          const user = await User.findById(userId);
      
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
          res.json({ success: true, bookmarks: user.bookmarks });
      
        } catch (error) {
          console.error("Erreur Signet:", error);
          res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * Gère le suivi/arrêt de suivi d'un autre utilisateur
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} Statut du suivi et nombre de followers
     */
    static async follow(req, res) {
        try {
            const userId = req.user.id; // L'utilisateur authentifié
            const targetId = req.params.id.trim() // L'utilisateur à suivre/ne plus suivre
        
            // Vérification que l'utilisateur ne tente pas de se suivre lui-même
            if (userId === targetId) {
              return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous-même." })
            }
        
            // Récupération des deux utilisateurs
            const user = await User.findById(userId)
            const targetUser = await User.findById(targetId)
        
            if (!targetUser) {
              return res.status(404).json({ error: "Utilisateur introuvable." })
            }
        
            // Vérification si l'utilisateur suit déjà la cible
            const alreadyFollowing = user.followings.includes(targetId)
        
            if (alreadyFollowing) {
              // Arrêt du suivi : retrait de la liste
              user.followings = user.followings.filter(id => id.toString() !== targetId)
              targetUser.followers = targetUser.followers.filter(id => id.toString() !== userId)
            } else {
                // Suivi : ajout à la liste
                user.followings.push(targetId)
                targetUser.followers.push(userId)
                // Ajout d'une notification pour l'utilisateur suivi
                const message = `${user.username} vous suit maintenant!`
                await addNotificationToQueue(targetUser._id.toString(), message)
            }
        
            // Sauvegarde des modifications
            await user.save();
            await targetUser.save();
        
            res.json({
              success: true,
              following: !alreadyFollowing,
              followersCount: targetUser.followers.length
            });
        
          } catch (error) {
            console.error("Erreur Follow:", error);
            res.status(500).json({ error: "Erreur interne du serveur" });
          }
    }

    /**
     * Récupère le fil des tweets d'un utilisateur (non implémenté)
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     */
    static async userTimeline(req, res) {
        // Méthode à implémenter
    }

    /**
     * Modifie le profil d'un utilisateur
     * @static
     * @async
     * @param {Object} req - Objet de requête Express
     * @param {Object} res - Objet de réponse Express
     * @returns {Object} Utilisateur mis à jour
     */
    static async edit(req, res) {
        try {
            console.log(req.user);
            // Vérification que l'utilisateur est authentifié
            if (!req.user) {
                console.error('Authentication error: req.user or req.user.id is undefined', {
                    user: req.user,
                    headers: req.headers
                });
                return res.status(401).json({ message: "Authentication failed - user not identified" });
            }

            // Récupération de l'ID utilisateur à partir de la requête authentifiée
            const userId = req.user.id;
            console.log('Processing update for user ID:', userId);

            // Extraction des données de la requête
            const { bio } = req.body;
            console.log('Update payload:', { bio, hasFile: !!req.file });

            // Gestion de l'image de profil
            const profile_img = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

            // Recherche de l'utilisateur par ID
            let user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Mise à jour des champs si fournis
            if (bio !== undefined) user.bio = bio;
            if (profile_img) user.profile_img = profile_img;

            // Génération d'un handle s'il n'existe pas déjà
            if (!user.handle && user.username) {
                user.handle = user.username.toLowerCase().replace(/\s+/g, '_');
            }

            // Sauvegarde des modifications
            await user.save();

            // Réponse avec l'utilisateur mis à jour
            res.status(200).json({
                message: "Profile updated successfully",
                user
            });
        } catch (error) {
            console.error('Error editing profile:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
}

// Export du contrôleur pour utilisation dans les routes
module.exports = userController