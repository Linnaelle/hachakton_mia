/**
 * Configuration des paramètres JWT (JSON Web Token)
 * Définit les options utilisées pour la génération et la validation des tokens
 */
const dotenv = require('dotenv')  // Import de dotenv pour les variables d'environnement

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config()

/**
 * Configuration pour les JWT
 * @typedef {Object} JwtConfig
 * @property {string} secret - Clé secrète utilisée pour signer les tokens
 * @property {string} accessTokenExpiration - Durée de validité des tokens d'accès
 * @property {string} refreshTokenExpiration - Durée de validité des tokens de rafraîchissement
 * @property {string} issuer - Émetteur des tokens (identifie l'application)
 * @property {string} audience - Public cible des tokens (les utilisateurs de l'application)
 */
const jwtConfig = {
    secret: process.env.JWT_SECRET,
    accessTokenExpiration: process.env.JWT_EXPIRE,
    refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRE,
    issuer: 'tweeter-app',
    audience: 'tweeter-users'
  }

// Export de la configuration pour utilisation dans d'autres modules
module.exports = jwtConfig