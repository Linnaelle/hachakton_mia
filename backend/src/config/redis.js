/**
 * Configuration et initialisation de la connexion Redis
 * Redis est utilisé pour la mise en cache et la gestion des sessions
 */
const Redis = require('ioredis');  // Import de ioredis pour la connexion à Redis
const dotenv = require('dotenv');  // Import de dotenv pour les variables d'environnement

// Chargement des variables d'environnement à partir du fichier .env
dotenv.config();

/**
 * Création d'une instance client Redis avec les paramètres de configuration
 * Les valeurs par défaut sont utilisées si les variables d'environnement ne sont pas définies
 */
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',  // Hôte Redis (par défaut localhost)
    port: process.env.REDIS_PORT || 6379,         // Port Redis (par défaut 6379)
    password: process.env.REDIS_PASSWORD || '',   // Mot de passe Redis (vide par défaut)
})

/**
 * Événement déclenché lorsque la connexion à Redis est établie
 */
redisClient.on('connect', () => {
    console.log('Connected to Redis');
})

/**
 * Événement déclenché en cas d'erreur de connexion à Redis
 */
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
})

// Export du client Redis pour utilisation dans d'autres modules
module.exports = redisClient