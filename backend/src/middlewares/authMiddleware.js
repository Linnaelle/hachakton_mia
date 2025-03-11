const redis = require('../config/redis')
const jwt = require('jsonwebtoken')

// Middleware pour JWT Token Validation
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1] // Bearer <token>
        // console.log(token)

        try {
            const user = jwt.verify(token, process.env.TOKEN_SECRET)
            if (!user) {
                return res.status(403).json({
                    success: false,
                    message: 'Token invalide',
                });
            }
            // const data = await redis.get(`blacklist_${token}`)
            // Vérifier si le token est dans la liste noire
            const isBlacklisted = await redis.get(`blacklist:${token}`)
            if (isBlacklisted) {
                return res.status(403).json({ message: 'Session expirée. Veuillez vous reconnecter.' })
                throw new Error("Session expirée. Veuillez vous reconnecter.");
            }
            req.user = user
            next()
        } catch(error){
            return res.status(500).json({ message: `Erreur serveur. ${error}` })
        }
        
    } else {
        res.status(401).json({
            success: false,
            message: 'Token non fourni',
        });
    }
}

module.exports = { authenticate }