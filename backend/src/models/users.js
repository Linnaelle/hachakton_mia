const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi =  require('joi')

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // sera hashe
    bio: { type: String, default: '' },
    profile_img: { type: String }, //url ou chemin de l'image
    banniere_img: { type: String }, //url ou chemin de l'image,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Tweet'}],

},
{
    timestamps: true
})

userSchema.index({ username: 1 })
userSchema.index({ email: 1 })

const User = mongoose.model('User', userSchema)

const userValidation = Joi.object({
    username: Joi.string()
    .required()
    .messages({
        'string.base': 'Username doit être une chaîne de caractères',
        'string.empty': 'Username ne peut pas être vide',
        'any.required': 'Username est requis'
    }),
    email: Joi.string()
    .required()
    .messages({
        'string.base': 'Email doit être une chaîne de caractères',
        'string.empty': 'Email ne peut pas être vide',
        'any.required': 'Email est requise'
    }),
    password: Joi.string()
        .required()
        .messages({
            'string.base': 'mot de passe doit être une chaîne de caractères',
            'string.empty': 'mot de passe  ne peut pas être vide',
            'any.required': 'mot de passe  est requis'
    }),
})