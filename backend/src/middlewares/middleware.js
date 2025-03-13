/**
 * Configuration des middlewares généraux
 * Principalement le middleware de gestion des téléchargements de fichiers
 */
const multer = require("multer")  // Middleware pour la gestion des fichiers multipart/form-data
const path = require("path")  // Module pour la gestion des chemins
const jwt = require('jsonwebtoken')  // Bibliothèque pour la gestion des JWT
const dotenv = require('dotenv')  // Gestion des variables d'environnement
const fs = require('fs')  // Module de gestion des fichiers

// Chargement des variables d'environnement
dotenv.config()

/**
 * Création du répertoire d'upload s'il n'existe pas
 */
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Configuration du stockage pour les fichiers téléchargés
 */
const storage = multer.diskStorage({
    // Définition du dossier de destination
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    // Définition du nom de fichier
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext)  // Nom unique basé sur le timestamp
    },
})
   
/**
 * Filtre pour vérifier le type de fichier
 * N'accepte que les fichiers image
 */
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);  // Accepter le fichier
    } else {
      cb(new Error("Only image files are allowed!"), false);  // Rejeter le fichier
    }
}
   
/**
 * Configuration du middleware multer
 * - Utilise le stockage personnalisé
 * - Applique le filtre de type de fichier
 * - Limite la taille des fichiers à 5 Mo
 */
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },  // 5 Mo
})

// Export du middleware upload pour utilisation dans les routes
module.exports = { upload }