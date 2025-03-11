const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require("path")
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require("fs")
const { graphqlUploadExpress } = require('graphql-upload')

app.use(cors())
app.use(bodyParser.json())
// Middleware pour l'upload
// app.use(graphqlUploadExpress())
app.use("/graphql", graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 5 }));
app.use("/api", express.json());
app.use("/api", express.urlencoded({ extended: true }));


const indexRoutes = require('./routes/index')
const tweetsRoute = require('./routes/tweetsRoute')
const usersRoute = require('./routes/usersRoute')

dotenv.config()
app.use(express.json())
app.use('/api/', indexRoutes)
app.use('/api/tweets', tweetsRoute)
app.use('/api/users', usersRoute)

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app