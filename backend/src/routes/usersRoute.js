/**
 * Routes pour les utilisateurs
 * Définit les endpoints API pour la gestion des utilisateurs
 */
const router = require('express').Router()  // Routeur Express
const userController = require('../controllers/userController')  // Contrôleur des utilisateurs
const { authenticateJWT } = require('../middlewares/authMiddleware')  // Middleware d'authentification
const { upload } = require('../middlewares/middleware')  // Middleware pour gérer les uploads de fichiers
const { getMe } = require('../controllers/authController')  // Fonction du contrôleur d'authentification

// Définition des routes pour les utilisateurs
router.post('/signup', upload.single("image"), userController.signUp)  // Inscription avec possibilité d'uploader une image de profil
router.post('/:id/follow', authenticateJWT, userController.follow)  // Suivre/ne plus suivre un utilisateur

router.put('/update', authenticateJWT, upload.single("image"), userController.edit)  // Mise à jour du profil avec possibilité d'uploader une image

router.get('/me', authenticateJWT, getMe)  // Récupération des informations de l'utilisateur connecté

// Export du routeur pour utilisation dans l'application principale
module.exports = router