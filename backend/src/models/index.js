/**
 * Point d'entrée pour les modèles
 * Facilite l'import de tous les modèles depuis un seul fichier
 */

// Import des modèles et de leurs schémas de validation
const { User, userValidation } = require('./users')  // Modèle et validation des utilisateurs
const { Tweet, tweetValidation } = require('./tweets')  // Modèle et validation des tweets
const { Comment, commentValidation } = require('./comments')  // Modèle et validation des commentaires
const { Like, likeValidation } = require('./likes')  // Modèle et validation des likes

// Export regroupé de tous les modèles et leurs validations
module.exports = {
  User, userValidation,
  Tweet, tweetValidation,
  Comment, commentValidation,
  Like, likeValidation
}