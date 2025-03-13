/**
 * Configuration de l'upload de fichiers
 * Configure Multer pour gérer les téléchargements de médias (images et vidéos)
 */
const multer = require('multer')  // Middleware pour la gestion des fichiers multipart/form-data
const path = require('path')  // Module pour la gestion des chemins
const fs = require('fs')  // Module de gestion des fichiers
const dotenv = require('dotenv')  // Gestion des variables d'environnement

// Chargement des variables d'environnement
dotenv.config()

/**
 * Vérification et création du dossier "uploads/" s'il n'existe pas
 */
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configuration du stockage pour les fichiers téléchargés
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
  // Définition du dossier de destination
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Dossier "uploads" à la racine du projet
  },
  // Définition du nom de fichier
  filename: (req, file, cb) => {
    // Utilisation du timestamp actuel + extension d'origine pour un nom unique
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

/**
 * Filtre pour vérifier le type de fichier
 * N'accepte que les images et les vidéos
 * @param {Object} req - Objet de requête Express
 * @param {Object} file - Fichier téléchargé
 * @param {Function} cb - Fonction de callback
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);  // Accepter le fichier
  } else {
    cb(new Error("Type de fichier non supporté"), false);  // Rejeter le fichier
  }
};

/**
 * Configuration du middleware multer
 * @type {multer.Multer}
 */
const upload = multer({ storage, fileFilter })

// Export du middleware pour utilisation dans les routes
module.exports = { upload }