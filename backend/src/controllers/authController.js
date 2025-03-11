const bcrypt = require('bcryptjs');
const { User, userValidation } = require('../models');
const tokenService = require('../services/tokenService');

/**
 * Contrôleur pour l'inscription des utilisateurs
 */
const register = async (req, res) => {
  try {
    // Validation des données d'entrée avec Joi
    const { error, value } = userValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password } = value;
    
    // Vérification si l'utilisateur existe déjà
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      return res.status(400).json({ 
        message: 'Cet email ou nom d\'utilisateur est déjà utilisé.' 
      });
    }
    
    // Hashage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Création d'un nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      bio: '',
      profile_img: 'default-profile.png',
      banniere_img: 'default-banner.png',
      followers: [],
      bookmarks: []
    });
    
    // Génération des tokens avec Redis
    const { accessToken, refreshToken } = await tokenService.generateTokens(newUser);
    
    // Réponse avec les tokens
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profile_img
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

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
        
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }
        
        const { accessToken, refreshToken } = await tokenService.generateTokens(user);
        
        res.status(200).json({
        message: 'Connexion réussie',
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profile_img
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
        const token = req.headers.authorization.split(' ')[1];
        
        await tokenService.blacklistToken(token);
        
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
};

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

module.exports = {
    register,
    login,
    logout,
    getMe,
    refreshToken
};