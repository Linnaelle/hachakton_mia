/**
 * Modèle et validation pour les tweets
 * Définit la structure des données et les règles de validation pour les tweets
 */
const mongoose = require('mongoose')  // ODM pour MongoDB
const Schema = mongoose.Schema  // Class de schéma Mongoose
const Joi = require('joi')  // Bibliothèque de validation
const objectId = require('../utils/joiObjectId')  // Extension Joi pour valider les ObjectId

/**
 * Schéma Mongoose pour les tweets
 * @typedef {Object} TweetSchema
 */
const tweetSchema = new Schema({
        // Contenu textuel du tweet
        content: { 
            type: String, 
            required: true, 
            maxlength: 280,  // Limite de caractères classique de Twitter
            index: true  // Index pour optimiser les recherches
        },
        // URL du média attaché au tweet (image, vidéo, etc.)
        media: { 
            type: String 
        },
        // Référence à l'auteur du tweet
        author: { 
            type: Schema.Types.ObjectId, 
            ref: 'User',  // Référence au modèle User
            required: true 
        },
        // Référence au tweet original en cas de retweet
        originalTweet: { 
            type: Schema.Types.ObjectId, 
            ref: 'Tweet'  // Référence au modèle Tweet
        },
        // Indique si ce tweet est un retweet
        isRetweet: { 
            type: Boolean, 
            default: false,  // Valeur par défaut
            index: true  // Index pour optimiser les recherches
        },
        // Liste des likes reçus par ce tweet
        likes: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Like'  // Référence au modèle Like
        }],
        // Liste des commentaires sur ce tweet
        comments: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Comment'  // Référence au modèle Comment
        }],
        // Liste des retweets de ce tweet
        retweets: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Tweet'  // Référence au modèle Tweet
        }],
        // Liste des utilisateurs mentionnés dans ce tweet
        mentions: [{ 
            type: Schema.Types.ObjectId, 
            ref: "User"  // Référence au modèle User
        }],
        // Liste des hashtags utilisés dans ce tweet
        hashtags: [{ 
            type: String, 
            lowercase: true,  // Toujours en minuscules pour l'uniformité
            index: true  // Index pour optimiser les recherches
        }]
    },
    {
        // Options du schéma
        timestamps: true  // Ajoute automatiquement createdAt et updatedAt
    })

// Ajout d'un index sur le champ createdAt pour optimiser les tris par date
tweetSchema.index({ createdAt: -1 })

/**
 * Modèle Mongoose pour les tweets
 * @type {mongoose.Model}
 */
const Tweet = mongoose.model('Tweet', tweetSchema)

/**
 * Schéma de validation Joi pour les tweets
 * @type {Joi.ObjectSchema}
 */
const tweetValidation = Joi.object({
    // Validation du contenu
    content: Joi.string().max(280).required()
        .messages({
            'string.base': 'Contenu doit être une chaîne de caractères',
            'string.empty': 'Contenu ne peut pas être vide',
            'string.max': 'Contenu ne peut pas dépasser {#limit} caractères',
            'any.required': 'Contenu est requis'
    }),
    // Validation des hashtags
    hashtags: Joi.array().items(Joi.string().trim().max(50))
        .messages({
            'array.base': 'Hashtags doit être un tableau',
            'string.base': 'Chaque hashtag doit être une chaîne de caractères',
            'string.max': 'Chaque hashtag ne peut pas dépasser {#limit} caractères'
        }),
    // Validation des mentions
    mentions: Joi.array().items(objectId)
        .messages({
            'array.base': 'Mentions doit être un tableau d\'ID utilisateur'
        }),
    // Validation du média
    media: Joi.string().optional()  // URL de média optionnelle
})

// Export du modèle et du schéma de validation
module.exports = { Tweet, tweetValidation }