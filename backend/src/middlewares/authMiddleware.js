/**
 * Middleware d'authentification
 * Gère la vérification des tokens JWT et les autorisations utilisateur
 */
const { verifyToken } = require('../services/tokenService');  // Service de vérification des tokens
const { User } = require('../models');  // Modèle utilisateur

/**
 * Middleware pour authentifier les utilisateurs via JWT
 * Vérifie le token et ajoute les informations utilisateur à la requête
 * @async
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void}
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Récupération de l'en-tête d'autorisation
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' })
    }
    
    // Extraction du token
    const token = authHeader.split(' ')[1]
    console.log(token)
  
    // Vérification et décodage du token
    const decoded = await verifyToken(token)
    console.log(decoded)
    
    // Recherche de l'utilisateur correspondant
    const user = await User.findById(decoded.id)
    console.log(user)
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' })
    }
    
    // Ajout des informations utilisateur à la requête
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    }
    
    // Passage au middleware suivant
    next()
  } catch (error) {
    // Gestion des différentes erreurs liées aux tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' })
    }
    
    if (error.message === 'Token is blacklisted') {
      return res.status(401).json({ message: 'Token révoqué. Veuillez vous reconnecter.' })
    }
    
    return res.status(401).json({ message: 'Token invalide.' })
  }
}

/**
 * Middleware pour vérifier si l'utilisateur a le rôle "debile"
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void}
 */
const isDebile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Accès non autorisé. Vous devez vous connecter.' })
  }

  if (req.user.role !== 'debile') {
    return res.status(403).json({ message: 'Accès interdit aux gens intelligent.' })
  }

  next()
}

/**
 * Middleware pour vérifier si l'utilisateur a le rôle "admin"
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void}
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Accès non autorisé. Vous devez vous connecter.' })
  }

  if (req.user.role!== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' })
  }

  next()
}

// Export des middlewares pour utilisation dans les routes
module.exports = { authenticateJWT, isDebile, isAdmin }