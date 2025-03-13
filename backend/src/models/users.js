/**
 * Modèle et validation pour les utilisateurs
 * Définit la structure des données et les règles de validation pour les utilisateurs
 */
const mongoose = require('mongoose')  // ODM pour MongoDB
const Schema = mongoose.Schema  // Class de schéma Mongoose
const Joi =  require('joi')  // Bibliothèque de validation

/**
 * Schéma Mongoose pour les utilisateurs
 * @typedef {Object} UserSchema
 */
const userSchema = new Schema({
    // Nom d'utilisateur
    username: { 
        type: String, 
        required: true, 
        unique: true,  // Unicité des noms d'utilisateur
        index: true  // Index pour optimiser les recherches
    },
    // Handle (identifiant unique pour l'URL)
    handle: { 
        type: String, 
        required: true, 
        unique: true,  // Unicité des handles
        lowercase: true,  // Toujours en minuscules pour l'uniformité
        trim: true,  // Suppression des espaces de début et de fin
        match: /^[a-zA-Z0-9_]{3,15}$/  // Format de handle (3-15 caractères, lettres, chiffres, underscores)
    },
    // Adresse email
    email: { 
        type: String, 
        required: true, 
        unique: true,  // Unicité des emails
        index: true  // Index pour optimiser les recherches
    },
    // Mot de passe (hashé)
    password: { 
        type: String, 
        required: true 
    },
    // Biographie de l'utilisateur
    bio: { 
        type: String, 
        default: ''  // Valeur par défaut
    },
    // URL de l'image de profil
    profile_img: { 
        type: String 
    }, 
    // URL de l'image de bannière
    banniere_img: { 
        type: String 
    },
    // Liste des utilisateurs qui suivent cet utilisateur
    followers: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User'  // Référence au modèle User
    }],
    // Liste des utilisateurs que cet utilisateur suit
    followings: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User'  // Référence au modèle User
    }],
    // Liste des tweets mis en favoris
    bookmarks: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Tweet'  // Référence au modèle Tweet
    }],
    // Rôle de l'utilisateur (normal, admin, debile)
    role: { 
        type: String, 
        enum: ['user', 'admin', 'debile'],  // Valeurs autorisées
        default: 'user'  // Valeur par défaut
    },
    // Indique si l'email a été vérifié
    isEmailVerified: { 
        type: Boolean, 
        default: false  // Valeur par défaut
    },
    // Token pour la vérification de l'email
    verificationToken: { 
        type: String 
    },
    // Date d'expiration du token de vérification
    verificationTokenExpires: { 
        type: Date 
    },
    // Token pour la réinitialisation du mot de passe
    resetPasswordToken: { 
        type: String 
    },
    // Date d'expiration du token de réinitialisation
    resetPasswordExpires: { 
        type: Date 
    }
},
{
    // Options du schéma
    timestamps: true  // Ajoute automatiquement createdAt et updatedAt
})

/**
 * Middleware pour générer automatiquement un handle unique avant sauvegarde si non défini
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
userSchema.pre('save', async function (next) {
    if (!this.handle) {
      // Création d'un handle de base à partir du nom d'utilisateur
      let baseHandle = this.username.toLowerCase().replace(/\s+/g, '_');  // Conversion en minuscule et remplacement des espaces
      let uniqueHandle = baseHandle;
      let count = 1;
  
      // Vérification de l'unicité du handle
      while (await mongoose.model('User').findOne({ handle: uniqueHandle })) {
        uniqueHandle = `${baseHandle}${count++}`;  // Ajout d'un nombre incrémental si le handle existe déjà
      }
  
      this.handle = uniqueHandle;
    }
    next();
});

/**
 * Modèle Mongoose pour les utilisateurs
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema)

/**
 * Schéma de validation Joi pour les utilisateurs
 * @type {Joi.ObjectSchema}
 */
const userValidation = Joi.object({
    // Validation du nom d'utilisateur
    username: Joi.string().min(3).max(30).required()
        .messages({
        'string.base': 'Username doit être une chaîne de caractères',
        'string.empty': 'Username ne peut pas être vide',
        'string.min': 'Username doit contenir au moins {#limit} caractères',
        'string.max': 'Username ne peut pas dépasser {#limit} caractères',
        'any.required': 'Username est requis'
    }),
    // Validation du handle désactivée - gérée par le modèle
    // handle: Joi.string()
    // .min(3)
    // .max(15)
    // .regex(/^[a-zA-Z0-9_]+$/)
    // .required()
    // .messages({
    //   'string.base': 'Handle doit être une chaîne de caractères',
    //   'string.empty': 'Handle ne peut pas être vide',
    //   'string.min': 'Handle doit contenir au moins {#limit} caractères',
    //   'string.max': 'Handle ne peut pas dépasser {#limit} caractères',
    //   'string.pattern.base': 'Handle ne peut contenir que des lettres, des chiffres et des underscores',
    //   'any.required': 'Handle est requis',
    // }),
    // Validation de l'email
    email: Joi.string().email().required()
        .messages({
        'string.base': 'Email doit être une chaîne de caractères',
        'string.empty': 'Email ne peut pas être vide',
        'string.email': 'Email doit être une adresse email valide',
        'any.required': 'Email est requis'
    }),
    // Validation du mot de passe
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).required()
        .messages({
        'string.base': 'Mot de passe doit être une chaîne de caractères',
        'string.empty': 'Mot de passe ne peut pas être vide',
        'string.min': 'Mot de passe doit contenir au moins {#limit} caractères',
        'string.pattern.base': 'Mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
        'any.required': 'Mot de passe est requis'
    }),
    // Validation de la biographie
    bio: Joi.string().max(160).allow('').default('')
        .messages({
        'string.base': 'Bio doit être une chaîne de caractères',
        'string.max': 'Bio ne peut pas dépasser {#limit} caractères'
    }),
    // Validation de l'image de profil
    profile_img: Joi.string().uri().allow('').default('default-profile.png')
        .messages({
        'string.base': 'L\'image de profil doit être une chaîne de caractères',
        'string.uri': 'L\'image de profil doit être une URL valide'
    }),
    // Validation de l'image de bannière
    banniere_img: Joi.string().uri().allow('').default('default-banner.png')
        .messages({
        'string.base': 'L\'image de bannière doit être une chaîne de caractères',
        'string.uri': 'L\'image de bannière doit être une URL valide'
    })
})

// Export du modèle et du schéma de validation
module.exports = { User, userValidation }