const app = require('./app.js')
const dotenv = require('dotenv')

const port = process.env.BACK_END_PORT || 5000
const connectDB = require('./config/db')
// Connect Database & Start Server
connectDB()
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
// generer cle secret
// require("crypto").randomBytes(64).toString("hex")