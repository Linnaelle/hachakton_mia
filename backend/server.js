const app = require('./src/app')
const dotenv = require('dotenv')
const { ApolloServer } = require('apollo-server')
const typeDefs = require('./src/graphql/typeDefs')
const resolvers = require('./src/graphql/resolvers')
const connectDB = require('./src/controllers/config/db')
const port = process.env.BACK_END_PORT || 5000

// Connexion a la db
connectDB()
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// Initialiser Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),  // Permet d'ajouter le contexte (ex: utilisateur)
});

server.listen().then(({ url }) => {
console.log(`🚀 Serveur GraphQL prêt sur ${url}`);
});