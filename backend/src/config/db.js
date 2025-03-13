/**
 * Configuration de la connexion à la base de données MongoDB
 * Ce module permet d'établir une connexion à MongoDB en utilisant Mongoose
 */
const mongoose = require('mongoose')   // Import de la bibliothèque Mongoose pour gérer MongoDB
const dotenv = require('dotenv')       // Import de dotenv pour les variables d'environnement

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config()

// Récupération de l'URL de connexion MongoDB à partir des variables d'environnement
const url = process.env.MONGODB_URI

/**
 * Établit une connexion à la base de données MongoDB
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // Tentative de connexion à MongoDB
        await mongoose.connect(url)
        console.log('Connected to the database')
    } catch (error) {
        // Gestion des erreurs de connexion
        console.log(error)
    }
}

// Export de la fonction pour utilisation dans d'autres modules
module.exports = connectDB