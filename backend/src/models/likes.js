/**
 * Modèle et validation pour les likes
 * Définit la structure des données et les règles de validation pour les likes
 */
const mongoose = require('mongoose')  // ODM pour MongoDB
const Schema = mongoose.Schema  // Class de schéma Mongoose
const Joi =  require('joi')  // Bibliothèque de validation
const objectId = require('../utils/joiObjectId')  // Extension Joi pour valider les ObjectId

/**
 * Schéma Mongoose pour les likes
 * @typedef {Object} LikeSchema
 */
const likeSchema = new Schema({
    // Référence à l'utilisateur qui a liké
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',  // Référence au modèle User
        required: true, 
        index: true  // Index pour optimiser les recherches
    },
    // Référence au tweet liké
    tweet: { 
        type: Schema.Types.ObjectId, 
        ref: 'Tweet',  // Référence au modèle Tweet
        required: true, 
        index: true  // Index pour optimiser les recherches
    },
},
{
    // Options du schéma
    timestamps: true  // Ajoute automatiquement createdAt et updatedAt
})

/**
 * Modèle Mongoose pour les likes
 * @type {mongoose.Model}
 */
const Like = mongoose.model('Like', likeSchema)

/**
 * Schéma de validation Joi pour les likes
 * @type {Joi.ObjectSchema}
 */
const likeValidation = Joi.object({
    // Validation de l'utilisateur
    user: objectId.required()
        .messages({
            'any.required': 'Utilisateur est requis',
            'any.invalid': 'ID d\'utilisateur invalide'
    }),
    // Validation du tweet
    tweet: objectId.required()
        .messages({
            'any.required': 'Tweet est requis',
            'any.invalid': 'ID du tweet invalide'
    })
})

// Export du modèle et du schéma de validation
module.exports = { Like, likeValidation }