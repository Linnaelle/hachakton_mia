/**
 * Configuration de la file d'attente pour le traitement des médias
 * Utilise Bull pour gérer le traitement asynchrone des fichiers médias
 */
const Queue = require('bull')  // Bibliothèque de gestion de files d'attente

/**
 * Création d'une file d'attente nommée "media-processing"
 * Configuration pour se connecter à Redis (backend de stockage de Bull)
 */
const mediaQueue = new Queue("media-processing", {
  redis: { host: "127.0.0.1", port: 6379 },  // Connexion à Redis local
});

/**
 * Définition du processus de traitement des médias
 * @async
 * @param {Object} job - Tâche Bull contenant les données du média à traiter
 */
mediaQueue.process(async (job) => {
  console.log(`📸 Traitement du média : ${job.data.filePath}`);

  // Simulation d'un traitement de média qui prend du temps
  // Dans un cas réel, cela pourrait être de la compression, du redimensionnement, etc.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log(`✅ Média traité : ${job.data.filePath}`);
});

// Export de la file d'attente pour utilisation dans d'autres modules
module.exports = mediaQueue