const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi =  require('joi')

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profile_img: { type: String }, 
    banniere_img: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    followings: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Tweet'}],
    role: { type: String, enum: ['user', 'admin', 'debile'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
},
{
    timestamps: true
})

const User = mongoose.model('User', userSchema)

const userValidation = Joi.object({
    username: Joi.string().min(3).max(30).required()
        .messages({
        'string.base': 'Username doit être une chaîne de caractères',
        'string.empty': 'Username ne peut pas être vide',
        'string.min': 'Username doit contenir au moins {#limit} caractères',
        'string.max': 'Username ne peut pas dépasser {#limit} caractères',
        'any.required': 'Username est requis'
    }),
    email: Joi.string().email().required()
        .messages({
        'string.base': 'Email doit être une chaîne de caractères',
        'string.empty': 'Email ne peut pas être vide',
        'string.email': 'Email doit être une adresse email valide',
        'any.required': 'Email est requis'
    }),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required()
        .messages({
        'string.base': 'Mot de passe doit être une chaîne de caractères',
        'string.empty': 'Mot de passe ne peut pas être vide',
        'string.min': 'Mot de passe doit contenir au moins {#limit} caractères',
        'string.pattern.base': 'Mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
        'any.required': 'Mot de passe est requis'
    }),
    bio: Joi.string().max(160).allow('').default('')
        .messages({
        'string.base': 'Bio doit être une chaîne de caractères',
        'string.max': 'Bio ne peut pas dépasser {#limit} caractères'
    }),
    profile_img: Joi.string().uri().allow('').default('default-profile.png')
        .messages({
        'string.base': 'L\'image de profil doit être une chaîne de caractères',
        'string.uri': 'L\'image de profil doit être une URL valide'
    }),
    banniere_img: Joi.string().uri().allow('').default('default-banner.png')
        .messages({
        'string.base': 'L\'image de bannière doit être une chaîne de caractères',
        'string.uri': 'L\'image de bannière doit être une URL valide'
    })
})

module.exports = { User, userValidation }