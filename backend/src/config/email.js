const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

let transporter

const initializeTransporter = async () => {
    if (process.env.NODE_ENV === 'development') {
        const testAccount = await nodemailer.createTestAccount()
        
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        
        console.log('Compte Ethereal créé:', testAccount.user)
        console.log('Mdp:', testAccount.pass)
        console.log('URL pour visualiser les emails:', testAccount.web)
    } else {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }
    return transporter
}

(async () => {
    try {
        transporter = await initializeTransporter();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation du transporteur email:', error);
    }
})()

// Fonction pour envoyer un email
const sendEmail = async (options) => {
    if (!transporter) {
        transporter = await initializeTransporter()
    }
    
    const info = await transporter.sendMail(options)
    
    if (process.env.NODE_ENV === 'development') {
        console.log('URL pour visualiser l\'email:', nodemailer.getTestMessageUrl(info))
    }
    
    return info
}

module.exports = { initializeTransporter, sendEmail, getTransporter: () => transporter }