/**
 * Routes d'administration
 * Définit les endpoints API réservés aux administrateurs
 */
const express = require('express')  // Framework web pour Node.js
const { authenticateJWT, isAdmin } = require('../middlewares/authMiddleware')  // Middlewares d'authentification
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/adminController')  // Fonctions du contrôleur admin

// Création d'un routeur Express
const router = express.Router()

// Application des middlewares d'authentification et de vérification du rôle admin
// pour toutes les routes de ce routeur
router.use(authenticateJWT, isAdmin)

// Définition des routes d'administration
router.get('/users', getAllUsers)  // Récupération de tous les utilisateurs
router.put('/users/role', updateUserRole)  // Mise à jour du rôle d'un utilisateur
router.delete('/users/:userId', deleteUser)  // Suppression d'un utilisateur

// Export du routeur pour utilisation dans l'application principale
module.exports = router