const express = require('express')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const {
    register,
    login,
    logout,
    getMe,
    refreshToken
} = require('../controllers/authController')

const router = express.Router()

// Routes publiques
router.post('/register', register)
router.post('/login', login)
router.post('/refresh-token', refreshToken)

// Routes protégées
router.post('/logout', authenticateJWT, logout)
router.get('/me', authenticateJWT, getMe)

module.exports = router