const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const connectDB = require('./config/db')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('API Tweeter - Bienvenue')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Une erreur est survenue sur le serveur' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})