const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require("path")
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require("fs")

app.use(cors())
app.use(bodyParser.json())


const indexRoutes = require('./routes/index')
const tweetsRoute = require('./routes/tweetsRoute')
const usersRoute = require('./routes/usersRoute')

dotenv.config()
app.use(express.json())
app.use('/', indexRoutes)
app.use('/tweets', tweetsRoute)
app.use('/users', usersRoute)

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app