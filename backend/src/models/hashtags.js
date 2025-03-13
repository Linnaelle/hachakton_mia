/**
 * Modèle pour les hashtags
 * Définit la structure des données pour suivre et gérer les hashtags
 */
const mongoose = require('mongoose')  // ODM pour MongoDB

/**
 * Schéma Mongoose pour les hashtags
 * @typedef {Object} HashtagSchema
 */
const HashtagSchema = new mongoose.Schema(
    {
        // Texte du hashtag
        tag: {
        type: String,
        required: true,
        unique: true,  // Unicité des hashtags
        lowercase: true,  // Toujours en minuscules pour l'uniformité
    },
        // Nombre de tweets contenant ce hashtag
        tweetCount: {
        type: Number,
        default: 0,  // Valeur par défaut
    },
        // Date de dernière utilisation
        lastUsedAt: {
        type: Date,
        default: Date.now,  // Date actuelle par défaut
    },
    },
    { 
        timestamps: true  // Ajoute automatiquement createdAt et updatedAt
    }
);

// Ajout d'un index pour optimiser les recherches par tag
HashtagSchema.index({ tag: 1 });

/**
 * Modèle Mongoose pour les hashtags
 * @type {mongoose.Model}
 */
const Hashtag = mongoose.model("Hashtag", HashtagSchema)

// Export du modèle
module.exports = Hashtag