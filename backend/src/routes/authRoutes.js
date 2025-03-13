/**
 * Routes d'authentification
 * Définit les endpoints API pour l'inscription, la connexion et la gestion des comptes
 */
const express = require('express')  // Framework web pour Node.js
const { authenticateJWT } = require('../middlewares/authMiddleware')  // Middleware d'authentification
const {
    register,
    login,
    logout,
    getMe,
    refreshToken,
    deleteAccount
} = require('../controllers/authController')  // Fonctions du contrôleur d'authentification
const {forgotPassword, resetPassword } = require('../controllers/passwordController')  // Fonctions de gestion des mots de passe
const { verifyEmail, sendVerificationEmail } = require('../controllers/emailController')  // Fonctions de vérification d'email
const { upload } = require('../middlewares/middleware')  // Middleware pour gérer les uploads de fichiers

// Création d'un routeur Express
const router = express.Router()

// Routes publiques (ne nécessitant pas d'authentification)
router.post('/register', upload.single("image"), register)  // Inscription avec possibilité d'uploader une image de profil
router.post('/login', login)  // Connexion
router.post('/refresh-token', refreshToken)  // Rafraîchissement du token d'accès
router.get('/verify-email/:token', verifyEmail)  // Vérification d'email avec token
router.post('/forgot-password', forgotPassword)  // Demande de réinitialisation de mot de passe
router.post('/reset-password', resetPassword)  // Réinitialisation de mot de passe
router.post('/resend-verification-email', sendVerificationEmail)  // Renvoi de l'email de vérification

// Routes protégées (nécessitant une authentification)
router.post('/logout', authenticateJWT, logout)  // Déconnexion
router.get('/me', authenticateJWT, getMe)  // Récupération des informations de l'utilisateur connecté
router.delete('/delete', authenticateJWT, deleteAccount)  // Suppression du compte

// Export du routeur pour utilisation dans l'application principale
module.exports = router;