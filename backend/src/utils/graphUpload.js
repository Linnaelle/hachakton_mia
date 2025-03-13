/**
 * Utilitaire pour la gestion des uploads avec GraphQL
 * Permet de gérer les fichiers téléchargés via l'API GraphQL
 */
const multer = require('multer')  // Middleware pour la gestion des fichiers multipart/form-data
const path = require('path')  // Module pour la gestion des chemins
const fs = require('fs')  // Module de gestion des fichiers
const dotenv = require('dotenv')  // Gestion des variables d'environnement

// Chargement des variables d'environnement
dotenv.config()

/**
 * Gère le téléchargement d'un fichier depuis une requête GraphQL
 * @async
 * @param {Promise<Object>} uploadFile - Promesse contenant le fichier à télécharger
 * @returns {Promise<string>} Chemin du fichier téléchargé
 */
const handleUpload = async (uploadFile) => {
  // Attend la résolution de la promesse et extrait les propriétés du fichier
  const { createReadStream, filename } = await uploadFile
  
  // Création du flux de lecture du fichier
  const stream = createReadStream()
  
  // Définition du chemin de destination
  const filePath = path.join(__dirname, '../uploads', filename)
  
  // Création du flux d'écriture vers le fichier de destination
  const writeStream = fs.createWriteStream(filePath)

  // Retourne une promesse qui résoudra avec le chemin relatif du fichier
  return new Promise((resolve, reject) => {
    // Redirection du flux de lecture vers le flux d'écriture
    stream.pipe(writeStream)
    
    // Gestion de la fin de l'écriture
    writeStream.on('finish', () => resolve(`/uploads/${filename}`))
    
    // Gestion des erreurs
    writeStream.on('error', reject)
  })
}

// Export de la fonction pour utilisation dans d'autres modules
module.exports = { handleUpload }