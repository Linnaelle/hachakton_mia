const router = require('express').Router()
const userController = require('../controllers/userController')
const { upload } = require('../middlewares/middleware')

// router.get("/:id", userController.getMe)
router.post('/signup', upload.single("image"), userController.signUp)

module.exports = router