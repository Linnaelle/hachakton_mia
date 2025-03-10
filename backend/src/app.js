const express = require('express')
const app = express()
const dotenv = require('dotenv')
const path = require("path")
const cors = require('cors')
app.use(cors())
// const fs = require("fs")

const indexRoutes = require('./routes/index')

dotenv.config()
app.use(express.json())
app.use('/', indexRoutes)

module.exports = app