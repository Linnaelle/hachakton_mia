const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi =  require('joi')

const likeSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tweet: { type: Schema.Types.ObjectId, ref: 'Tweet', required: true }, // Retweet references
},
{
    timestamps: true
})

const Like = mongoose.model('Like', likeSchema)

const likeValidation = Joi.object({
    user: Joi.string()
    .required()
    .messages({
            'string.base': 'User doit être un id objet',
            'string.empty': 'User ne peut pas être vide',
            'any.required': 'User est requis'
        }),
    tweet: Joi.string()
    .required()
    .messages({
        'string.base': 'Tweet doit être un id objet',
        'string.empty': 'Tweet ne peut pas être vide',
        'any.required': 'Tweet est requis'
    }),
})

module.exports = { Like, likeValidation }