const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
const objectId = require('../utils/joiObjectId')

const tweetSchema = new Schema({
    content: { type: String, required: true, maxlength: 280, index: true },
    media: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalTweet: { type: Schema.Types.ObjectId, ref: 'Tweet'},
    isRetweet: { type: Boolean, default: false, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hashtags: [{ type: String, lowercase: true, index: true }]
},
{
    timestamps: true
})

tweetSchema.index({ createdAt: -1 })

const Tweet = mongoose.model('Tweet', tweetSchema)

const tweetValidation = Joi.object({
    content: Joi.string().max(280).required()
        .messages({
            'string.base': 'Contenu doit être une chaîne de caractères',
            'string.empty': 'Contenu ne peut pas être vide',
            'string.max': 'Contenu ne peut pas dépasser {#limit} caractères',
            'any.required': 'Contenu est requis'
    })
})
module.exports = { Tweet, tweetValidation }