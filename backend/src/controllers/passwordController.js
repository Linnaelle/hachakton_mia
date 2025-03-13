/**
 * Contrôleur pour la gestion des mots de passe
 * Gère les fonctionnalités de récupération et réinitialisation de mot de passe
 */
const emailService = require('../services/emailService')  // Service d'envoi d'emails
const { User } = require('../models')  // Modèle utilisateur
const bcrypt = require('bcryptjs')  // Bibliothèque pour le hashage des mots de passe

/**
 * Gère la demande de récupération de mot de passe oublié
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation de l'envoi de l'email de réinitialisation
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        
        // Recherche de l'utilisateur par email
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(404).json({ message: 'Aucun compte associé à cet email' })
        }
        
        // Génération d'un token de réinitialisation
        const resetToken = emailService.generateToken()
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000)  // Expire dans 1h
        
        // Mise à jour du token dans la base de données
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = resetTokenExpires
        await user.save()
        
        // Génération de l'URL pour la réinitialisation du mot de passe
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
        
        // Envoi de l'email de réinitialisation
        try {
            await emailService.sendPasswordResetEmail(user, resetUrl)
          } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError)
          }
        
        res.status(200).json({ message: 'Email de réinitialisation envoyé' })
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}
  
/**
 * Réinitialise le mot de passe de l'utilisateur avec le token reçu
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation de la réinitialisation
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        
        // Recherche de l'utilisateur par token de réinitialisation (valide et non expiré)
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Token non expiré
        })
        
        if (!user) {
            return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' })
        }
        
        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        
        // Mise à jour du mot de passe et suppression du token
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

// Export des fonctions du contrôleur pour utilisation dans les routes
module.exports = { 
    forgotPassword, 
    resetPassword
}