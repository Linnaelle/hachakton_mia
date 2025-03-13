/**
 * Configuration du client Elasticsearch
 * Établit la connexion avec le serveur Elasticsearch pour les fonctionnalités de recherche
 */
const { Client } = require('@elastic/elasticsearch')  // Client Elasticsearch officiel

/**
 * Création d'une instance du client Elasticsearch
 * Configurée pour se connecter au serveur local par défaut
 * @type {Client}
 */
const esClient = new Client({ node: "http://localhost:9200" })

// Export du client pour utilisation dans d'autres modules
module.exports = esClient