const { verifyToken } = require('../services/tokenService');
const { User } = require('../models');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    const decoded = await verifyToken(token);
    
    const user = await User.findById(decoded.id)
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' })
    }
    
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré.' })
    }
    
    if (error.message === 'Token is blacklisted') {
      return res.status(401).json({ message: 'Token révoqué. Veuillez vous reconnecter.' })
    }
    
    return res.status(401).json({ message: 'Token invalide.' })
  }
}

module.exports = { authenticateJWT }