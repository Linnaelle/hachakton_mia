/**
 * Routes pour les tweets
 * Définit les endpoints API pour la gestion des tweets
 */
const router = require('express').Router()  // Routeur Express
const tweetController = require('../controllers/tweetController')  // Contrôleur des tweets
const { upload } = require('../utils/uploads')  // Utilitaire pour gérer les uploads de médias
const { authenticateJWT } = require('../middlewares/authMiddleware')  // Middleware d'authentification

// Définition des routes pour les tweets
router.get('/', authenticateJWT, tweetController.getTimeline)  // Récupération de la timeline personnalisée
router.post('/', authenticateJWT, upload.single('media'), tweetController.createTweet)  // Création d'un tweet avec possibilité d'uploader un média
router.delete('/:id', authenticateJWT, tweetController.deleteTweet)  // Suppression d'un tweet
router.post('/:id/comment', authenticateJWT, tweetController.comment)  // Ajout d'un commentaire à un tweet
router.get('/:id', tweetController.getTweet)  // Récupération d'un tweet spécifique (route publique)
router.post('/:id/like', authenticateJWT, tweetController.likeTweet)  // Like/unlike d'un tweet
router.post('/:id/retweet', authenticateJWT, tweetController.reTweet)  // Retweet/annulation de retweet
router.get('/all', tweetController.getAllTweets)  // Récupération de tous les tweets (route publique)

// Export du routeur pour utilisation dans l'application principale
module.exports = router