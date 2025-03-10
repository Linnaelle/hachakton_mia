const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

const commentSchema = new Schema({
    content: { type: String, required: true, maxlength: 280},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tweet: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true }, // Retweet references
},
{
    timestamps: true
})

commentSchema.index({ author: 1 })
commentSchema.index({ tweet: 1 })

const Comment = mongoose.model('Comment', commentSchema)

const commentValidation = Joi.object({
    content: Joi.string().max(280)
    .required()
    .messages({
        'string.base': 'Commentaire doit être une chaine',
        'string.empty': 'Commentaire ne peut pas être vide',
        'any.required': 'Comment est requis'
    }),
    author: Joi.string()
    .required(),
    tweet: Joi.string()
    .required()
})

module.exports = { Comment, commentValidation }