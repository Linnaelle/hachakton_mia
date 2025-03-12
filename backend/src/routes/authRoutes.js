const express = require('express')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const {
    register,
    login,
    logout,
    getMe,
    refreshToken,
    deleteAccount,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/authController')
const emailVerifiedRequired = require('../middlewares/emailVerifiedMiddleware')

const router = express.Router()

// Routes publiques
router.post('/register', register)
router.post('/refresh-token', refreshToken)
router.get('/verify-email/:token', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Routes protégées
router.post('/logout', authenticateJWT, logout)
router.post('/login', authenticateJWT, emailVerifiedRequired, login)
router.get('/me', authenticateJWT, emailVerifiedRequired, getMe)
router.delete('/delete', authenticateJWT, deleteAccount)

module.exports = router