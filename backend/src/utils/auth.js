const dotenv = require('dotenv');

const jwt = require('jsonwebtoken');
const redis = require('redis');

// get config vars
dotenv.config()

const  generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET,
        { expiresIn: '1800s' })
}

module.exports = { generateAccessToken }