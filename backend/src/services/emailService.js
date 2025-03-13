/**
 * Service d'envoi d'emails
 * Gère la génération de tokens et l'envoi d'emails pour diverses fonctionnalités
 */
const { sendEmail } = require('../config/email')  // Fonction de base pour l'envoi d'emails
const crypto = require('crypto')  // Module pour les opérations cryptographiques

/**
 * Génère un token aléatoire hexadécimal
 * Utilisé pour la vérification d'email et la réinitialisation de mot de passe
 * @returns {string} Token hexadécimal de 40 caractères
 */
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex')  // Génère 20 octets aléatoires et les convertit en hexadécimal
};

/**
 * Envoie un email de vérification à un utilisateur
 * @async
 * @param {Object} user - Utilisateur destinataire
 * @param {string} verificationUrl - URL pour vérifier l'email
 * @returns {Promise<Object>} Résultat de l'envoi d'email
 */
const sendVerificationEmail = async (user, verificationUrl) => {
  return await sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@tweeter.com',  // Expéditeur de l'email
    to: user.email,  // Destinataire (l'utilisateur)
    subject: 'Vérification de votre compte Tweeter',  // Sujet de l'email
    html: `
      <h1>Bienvenue sur Tweeter!</h1>
      <p>Pour vérifier votre adresse email, veuillez cliquer sur le lien suivant:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Ce lien expirera dans 24 heures.</p>
      <p>Si vous n'avez pas créé de compte, veuillez ignorer cet email.</p>
    `  // Corps de l'email en HTML
  })
}

/**
 * Envoie un email de réinitialisation de mot de passe à un utilisateur
 * @async
 * @param {Object} user - Utilisateur destinataire
 * @param {string} resetUrl - URL pour réinitialiser le mot de passe
 * @returns {Promise<Object>} Résultat de l'envoi d'email
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
  return await sendEmail({
    from: process.env.EMAIL_FROM || 'noreply@tweeter.com',  // Expéditeur de l'email
    to: user.email,  // Destinataire (l'utilisateur)
    subject: 'Réinitialisation de votre mot de passe Tweeter',  // Sujet de l'email
    html: `
      <h1>Réinitialisation de mot de passe</h1>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Ce lien expirera dans 1 heure.</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
    `  // Corps de l'email en HTML
  })
}

// Export des fonctions du service pour utilisation dans d'autres modules
module.exports = {
    generateToken,
    sendVerificationEmail,
    sendPasswordResetEmail
}