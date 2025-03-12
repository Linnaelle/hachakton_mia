const multer = require("multer")
const path = require("path")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

// Vérifier et créer le dossier "uploads/"
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Ensure that the 'uploads' folder exists in your project root
      cb(null, "uploads/");
      // cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
      // Create a unique filename using the current timestamp and original file extension.
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext)
    },
})
   
  // File filter to only accept images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
}
   
// Initialize Multer middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB ma
})

module.exports = { upload }