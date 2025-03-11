const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const tweetSchema = new Schema({
    content: { type: String, required: true, maxlength: 280},
    media: { type: String },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    originalTweet: { type: Schema.Types.ObjectId, ref: 'Tweet'},
    isRetweet: { type: Boolean, default: false },
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }], // Utilisateurs mentionnés (@)
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }], // Retweet references
    hashtags: [{ type: String, lowercase: true, index: true}]
},
{
    timestamps: true
})

tweetSchema.index({ author: 1 })
tweetSchema.index({ isRetweet: 1 })
tweetSchema.index({ createdAt: -1 })
tweetSchema.index({ content: "text" })

const Tweet = mongoose.model('Tweet', tweetSchema)

const tweetValidation = Joi.object({
    content: Joi.string().max(280)
    .required()
    .messages({
        'string.base': 'Contenu doit être une chaine',
        'string.empty': 'Contenu ne peut pas être vide',
        'any.required': 'Contenu est requis'
    }),
    hashtags: Joi.array()
})

module.exports = { Tweet, tweetValidation }