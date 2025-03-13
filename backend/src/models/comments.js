/**
 * Modèle et validation pour les commentaires
 * Définit la structure des données et les règles de validation pour les commentaires
 */
const mongoose = require('mongoose')  // ODM pour MongoDB
const Schema = mongoose.Schema  // Class de schéma Mongoose
const Joi = require('joi')  // Bibliothèque de validation
const objectId = require('../utils/joiObjectId')  // Extension Joi pour valider les ObjectId

/**
 * Schéma Mongoose pour les commentaires
 * @typedef {Object} CommentSchema
 */
const commentSchema = new Schema({
    // Contenu du commentaire
    content: { 
        type: String, 
        required: true, 
        maxlength: 280  // Limite de caractères comme pour un tweet
    },
    // Référence à l'auteur du commentaire
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',  // Référence au modèle User
        required: true, 
        index: true  // Index pour optimiser les recherches
    },
    // Référence au tweet commenté
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
 * Modèle Mongoose pour les commentaires
 * @type {mongoose.Model}
 */
const Comment = mongoose.model('Comment', commentSchema)

/**
 * Schéma de validation Joi pour les commentaires
 * @type {Joi.ObjectSchema}
 */
const commentValidation = Joi.object({
    // Validation du contenu
    content: Joi.string().max(280).required()
        .messages({
            'string.base': 'Commentaire doit être une chaîne de caractères',
            'string.empty': 'Commentaire ne peut pas être vide',
            'string.max': 'Commentaire ne peut pas dépasser {#limit} caractères',
            'any.required': 'Commentaire est requis'
    })
})

// Export du modèle et du schéma de validation
module.exports = { Comment, commentValidation }