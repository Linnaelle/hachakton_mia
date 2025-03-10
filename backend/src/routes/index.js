const router = require('express').Router()
// const { validateToken } = require("../middleware/middleware")

router.get('/', (req, res) => {
    res.send('Hello World')
})

// Protected route
// router.get('/protected', validateToken, (req, res) => {
//     console.log('in')
//     return res.json({ message: 'This is a protected route.', user: req.payload })
// });

module.exports = router 