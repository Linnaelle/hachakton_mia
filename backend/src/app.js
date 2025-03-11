const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require("fs")
const dotenv = require('dotenv')

const indexRoutes = require('./routes/index')
const tweetsRoute = require('./routes/tweetsRoute')
const usersRoute = require('./routes/usersRoute')
const authRoutes = require('./routes/authRoutes')

dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use('/', indexRoutes)
app.use('/tweets', tweetsRoute)
app.use('/users', usersRoute)
app.use('/api/auth', authRoutes)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get('/', (req, res) => {
    res.send('API Tweeter - Bienvenue')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Une erreur est survenue sur le serveur' })
})