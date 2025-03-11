const dotenv = require('dotenv')
const { User } = require('../models/users')
const jwt = require('jsonwebtoken')
const redis = require('redis')

// get config vars
dotenv.config()

const  generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.TOKEN_SECRET,
        { expiresIn: '1800s' })
}

const verifyToken = async (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return null
  
    const token = authHeader.split(" ")[1]
    console.log(authHeader)
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      const user = await User.findById(decoded.id)
      return user;
    } catch (err) {
      return null
    }
};

module.exports = { generateAccessToken, verifyToken }