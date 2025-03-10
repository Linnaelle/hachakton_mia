const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const tweetSchema = new Schema({
    content: { type: String, required: true, maxlength: 280},
    media: { type: String },
    author: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    originalTweet: { type: Schema.Types.ObjectId, ref: 'Tweet'},
    isRetweet: { type: Boolean, default: false },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }], // Retweet references
},
{
    timestamps: true
})

const Tweet = mongoose.model('Tweet', tweetSchema)

const tweetValidation = Joi.object({
    content: Joi.string().max(280)
    .required()
    .message({
        'string.base': 'Contenu doit être une chaine',
        'string.empty': 'Contenu ne peut pas être vide',
        'any.required': 'Contenu est requis'
    })
})

module.exports = { Tweet, tweetValidation }