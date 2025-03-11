const mongoose = require('mongoose')
// const dbCon = require('mongodb').MongoClient
const dotenv = require('dotenv')

dotenv.config()
const url = process.env.db_url
console.log(url)

const connectDB = async () => {
    try {
        await mongoose.connect(url, { useUnifiedTopology: true })
        console.log('Connected to the database')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB