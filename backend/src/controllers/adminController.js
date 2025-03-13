/**
 * Contrôleur pour la gestion des fonctionnalités administrateur
 * Gère les actions réservées aux administrateurs comme la gestion des utilisateurs
 */
const { Tweet, Like, User, Comment } = require('../models')

/**
 * Récupère tous les utilisateurs de la plateforme
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Liste des utilisateurs (sans leurs mots de passe)
 */
const getAllUsers = async (req, res) => {
    try {
        // Récupère tous les utilisateurs sans inclure le champ password
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        console.log(`Erreur lors de la récupération des utilisateurs : ${error} `)
        res.status(500).json({ message: "Erreur serveur." })
    }
}

/**
 * Met à jour le rôle d'un utilisateur (admin ou user)
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation et données de l'utilisateur mis à jour
 */
const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body

        // Validation des données d'entrée
        if (!userId || !role) {
            return res.status(400).json({ message: "ID utilisateur et rôle requis." })
        }

        // Vérification que le rôle est valide
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: "Rôle invalide." })
        }

        // Recherche de l'utilisateur
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." })
        }

        // Mise à jour du rôle et sauvegarde
        user.role = role
        await user.save()

        // Réponse avec les informations mises à jour
        res.status(200).json({ 
            message: "Rôle de l'utilisateur mis à jour.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(`Erreur lors de la mise à jour du rôle de l'utilisateur : ${error} `)
        res.status(500).json({ message: "Erreur serveur." })
    }
}

/**
 * Supprime un utilisateur et toutes ses données associées
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Confirmation de la suppression
 */
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        
        // Recherche de l'utilisateur
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        
        // Vérification des permissions (un admin ne peut pas supprimer un autre admin)
        if (user.role === 'admin' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Vous ne pouvez pas supprimer un autre administrateur' })
        }
        
        // Révocation de tous les tokens de l'utilisateur
        await tokenService.revokeAllUserTokens(userId)
        
        // Suppression de l'utilisateur et de toutes ses données associées
        await User.findByIdAndDelete(userId)
        await Tweet.deleteMany({ author: userId })
        await Like.deleteMany({ user: userId })
        await Comment.deleteMany({ author: userId })
        
        res.status(200).json({ message: 'Utilisateur supprimé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

// Export des fonctions du contrôleur pour utilisation dans les routes
module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser
}