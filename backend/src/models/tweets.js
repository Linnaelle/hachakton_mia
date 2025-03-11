const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
const objectId = require('../utils/joiObjectId')

const tweetSchema = new Schema({
    content: { type: String, required: true, maxlength: 280},
    media: { type: String },
    author: [{ type: Schema.Types.ObjectId, ref: 'User', index: true  }],
    originalTweet: { type: Schema.Types.ObjectId, ref: 'Tweet'},
    isRetweet: { type: Boolean, default: false, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
},
{
    timestamps: true
})

const Tweet = mongoose.model('Tweet', tweetSchema)

const tweetValidation = Joi.object({
    content: Joi.string().max(280).required()
        .messages({
            'string.base': 'Contenu doit être une chaîne de caractères',
            'string.empty': 'Contenu ne peut pas être vide',
            'string.max': 'Contenu ne peut pas dépasser {#limit} caractères',
            'any.required': 'Contenu est requis'
    }),
    media: Joi.string().uri().allow('').optional()
        .messages({
            'string.base': 'Le média doit être une chaîne de caractères',
            'string.uri': 'Le média doit être une URL valide'
    }),
    author: Joi.array().items(objectId).min(1).required()
        .messages({
            'array.base': 'Author doit être un tableau',
            'array.min': 'Au moins un auteur est requis',
            'any.required': 'Auteur est requis'
    }),
    originalTweet: objectId.optional().allow(null)
        .messages({
            'any.invalid': 'ID du tweet original invalide'
    }),
    isRetweet: Joi.boolean().default(false)
        .messages({
            'boolean.base': 'isRetweet doit être un booléen'
    }),
    likes: Joi.array().items(objectId).default([])
        .messages({
            'array.base': 'Likes doit être un tableau'
    }),
    comments: Joi.array().items(objectId).default([])
        .messages({
            'array.base': 'Comments doit être un tableau'
    }),
    retweets: Joi.array().items(objectId).default([])
        .messages({
            'array.base': 'Retweets doit être un tableau'
    })
})
module.exports = { Tweet, tweetValidation }