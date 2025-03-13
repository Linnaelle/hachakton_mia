/**
 * Contrôleur pour la gestion des fonctionnalités liées aux emails
 * Gère l'envoi et la vérification des emails
 */
const emailService = require('../services/emailService')  // Service d'envoi d'emails
const { User } = require('../models')  // Modèle utilisateur

/**
 * Envoie un email de vérification à l'utilisateur
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation de l'envoi de l'email
 */
const sendVerificationEmail = async (req, res) => {
    try {
        const userId = req.user?.id
        
        // Cas 1: Utilisateur authentifié (réenvoi du mail de vérification)
        if (userId) {
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' })
            }
            
            if (user.isEmailVerified) {
                return res.status(400).json({ message: 'Votre email est déjà vérifié' })
            }
            
            // Génération d'un nouveau token de vérification
            const verificationToken = emailService.generateToken()
            const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)  // Expire dans 24h
            
            // Mise à jour du token dans la base de données
            user.verificationToken = verificationToken 
            user.verificationTokenExpires = verificationTokenExpires 
            await user.save()
            
            // Génération de l'URL pour la vérification de l'email
            const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
            
            // Envoi de l'email de vérification
            await emailService.sendVerificationEmail(user, verificationUrl)
            
            return res.status(200).json({ message: 'Email de vérification renvoyé avec succès' })
        }
        
        // Cas 2: Utilisateur non authentifié (requête spécifique avec userId dans le body)
        const { userId: bodyUserId } = req.body
        
        if (!bodyUserId) {
            return res.status(400).json({ message: 'ID utilisateur requis' })
        }
        
        const user = await User.findById(bodyUserId);
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email déjà vérifié' })
        }
        
        // Génération d'un nouveau token de vérification
        const verificationToken = emailService.generateToken()
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)  // Expire dans 24h
        
        // Mise à jour du token dans la base de données
        user.verificationToken = verificationToken
        user.verificationTokenExpires = verificationTokenExpires
        await user.save()
        
        // Génération de l'URL pour la vérification de l'email
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
        
        // Envoi de l'email de vérification
        await emailService.sendVerificationEmail(user, verificationUrl)
        
        res.status(200).json({ message: 'Email de vérification envoyé' })
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de vérification:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Vérifie l'email de l'utilisateur à l'aide du token reçu
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation de la vérification
 */
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        
        // Recherche de l'utilisateur par token de vérification (valide et non expiré)
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }  // Token non expiré
        })
        
        if (!user) {
            return res.status(400).json({ message: 'Token de vérification invalide ou expiré' })
        }
        
        // Marquer l'email comme vérifié et supprimer le token
        user.isEmailVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()
        
        res.status(200).json({ message: 'Email vérifié avec succès' })
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

// Export des fonctions du contrôleur pour utilisation dans les routes
module.exports = {
    sendVerificationEmail,
    verifyEmail
}