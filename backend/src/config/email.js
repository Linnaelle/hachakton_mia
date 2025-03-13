/**
 * Configuration et gestion de l'envoi d'emails
 * Ce module utilise nodemailer pour créer et gérer les transports d'emails
 */
const nodemailer = require('nodemailer')  // Import de nodemailer pour l'envoi d'emails
const dotenv = require('dotenv')          // Import de dotenv pour les variables d'environnement

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config()

// Déclaration du transporteur pour l'envoi d'emails
let transporter

/**
 * Initialise le transporteur pour l'envoi d'emails avec les paramètres de configuration
 * @async
 * @returns {Object} L'instance du transporteur configurée
 */
const initializeTransporter = async () => {
    // Création d'un transporteur SMTP avec les paramètres des variables d'environnement
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    return transporter
}

// Fonction auto-exécutée pour initialiser le transporteur au démarrage
(async () => {
    try {
        transporter = await initializeTransporter();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du transporteur email:', error);
    }
})()

/**
 * Envoie un email avec les options spécifiées
 * @async
 * @param {Object} options - Options d'envoi d'email (destinataire, sujet, contenu, etc.)
 * @returns {Object} Les informations sur l'email envoyé
 */
const sendEmail = async (options) => {
    // Réinitialise le transporteur s'il n'est pas déjà initialisé
    if (!transporter) {
        transporter = await initializeTransporter()
    }
    
    // Envoi de l'email avec les options spécifiées
    const info = await transporter.sendMail(options)
    
    return info
}

// Export des fonctions pour utilisation dans d'autres modules
module.exports = { 
    initializeTransporter, 
    sendEmail, 
    getTransporter: () => transporter  // Fonction pour accéder au transporteur
}