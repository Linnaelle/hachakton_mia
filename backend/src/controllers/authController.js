const bcrypt = require('bcryptjs')
const { Tweet, Like, Comment, User, userValidation } = require('../models')
const tokenService = require('../services/tokenService')
const emailService = require('../services/emailService');

/**
 * Contrôleur pour l'inscription des utilisateurs
 */
const register = async (req, res) => {
    try {
        const { error, value } = userValidation.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const { username, email, password } = value
        
        const userExists = await User.findOne({ 
        $or: [{ email }, { username }] 
        });
        
        if (userExists) {
            return res.status(400).json({ 
                message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
            });
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const verificationToken = emailService.generateToken()
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            bio: '',
            profile_img: 'default-profile.png',
            banniere_img: 'default-banner.png',
            followers: [],
            bookmarks: [],
            verificationToken,
            verificationTokenExpires,
            isEmailVerified: false
        })

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`

        try {
            await emailService.sendVerificationEmail(newUser, verificationUrl);
        } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        }

        const { accessToken, refreshToken } = await tokenService.generateTokens(newUser)
        
        res.status(201).json({
            message: 'Utilisateur créé avec succès. Veuillez vérifier votre email.',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profile_img,
                isEmailVerified: newUser.isEmailVerified
            },
            tokens: {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error)
        res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' })
    }
}

/**
 * Contrôleur pour la connexion des utilisateurs
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' })
        }
        
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }
        
        const { accessToken, refreshToken } = await tokenService.generateTokens(user)
        
        res.status(200).json({
        message: 'Connexion réussie',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profile_img,
            isEmailVerified: user.isEmailVerified
        },
        tokens: {
            accessToken,
            refreshToken
        }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error)
        res.status(500).json({ message: 'Erreur serveur lors de la connexion' })
    }
}

/**
 * Contrôleur pour la déconnexion
 */
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)
        await tokenService.blacklistToken(token)
        
        await tokenService.revokeAllUserTokens(req.user.id)
        
        res.status(200).json({ message: 'Déconnexion réussie' })
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
        res.status(500).json({ message: 'Erreur serveur lors de la déconnexion' })
    }
}

/**
 * Contrôleur pour récupérer les informations de l'utilisateur connecté
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        
        res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profile_img,
            bannerPicture: user.banniere_img,
            bio: user.bio,
            followers: user.followers.length,
            following: user.following ? user.following.length : 0,
            createdAt: user.createdAt
        }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Contrôleur pour rafraîchir le token d'accès avec un token de rafraîchissement
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body
        
        if (!refreshToken) {
            return res.status(400).json({ message: 'Token de rafraîchissement manquant' })
        }
        
        const newAccessToken = await tokenService.refreshAccessToken(refreshToken)
        
        res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token de rafraîchissement expiré, reconnexion nécessaire' })
        }
        
        if (error.message === 'Invalid refresh token') {
            return res.status(401).json({ message: 'Token de rafraîchissement invalide ou révoqué' })
        }
        
        console.error('Erreur lors du rafraîchissement du token:', error)
        res.status(401).json({ message: 'Token de rafraîchissement invalide' })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params
        
        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        })
        
        if (!user) {
            return res.status(400).json({ message: 'Token de vérification invalide ou expiré' })
        }
        
        user.isEmailVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpires = undefined
        await user.save()
        
        res.status(200).json({ message: 'Email vérifié avec succès' })
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}
  
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(404).json({ message: 'Aucun compte associé à cet email' })
        }
        
        const resetToken = emailService.generateToken()
        const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000)
        
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = resetTokenExpires
        await user.save()
        
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
        
        try {
            await emailService.sendPasswordResetEmail(user, resetUrl)
          } catch (emailError) {
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', emailError)
          }
        
        res.status(200).json({ message: 'Email de réinitialisation envoyé' })
    } catch (error) {
        console.error('Erreur lors de la demande de réinitialisation:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}
  
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body
        
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        
        if (!user) {
            return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' })
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()
        
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

/**
 * Contrôleur pour supprimer un compte utilisateur
 */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id
        
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        
        try {
            const token = req.headers.authorization.split(' ')[1]
            await tokenService.blacklistToken(token)
        } catch (tokenError) {
            console.error('Erreur lors de la mise en liste noire du token:', tokenError)
        }
        
        try {
            await tokenService.revokeAllUserTokens(userId)
        } catch (revokeError) {
            console.error('Erreur lors de la révocation des tokens:', revokeError)
        }
        
        await User.findByIdAndDelete(userId)
        await Tweet.deleteMany({ author: userId })
        await Like.deleteMany({ user: userId })
        await Comment.deleteMany({ author: userId })
        
        res.status(200).json({ message: 'Compte supprimé avec succès' })
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error)
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du compte' })
    }
}

const resendVerificationEmail = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }
        
        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Votre email est déjà vérifié' })
        }
        
        const verificationToken = emailService.generateToken()
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        
        user.verificationToken = verificationToken
        user.verificationTokenExpires = verificationTokenExpires
        await user.save()
        
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`
        
        await emailService.sendVerificationEmail(user, verificationUrl)
        
        res.status(200).json({ message: 'Email de vérification renvoyé avec succès' })
    } catch (error) {
        console.error('Erreur lors du renvoi de l\'email de vérification:', error)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

module.exports = {
    register,
    login,
    logout,
    getMe,
    refreshToken,
    deleteAccount,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerificationEmail
}