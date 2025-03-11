const router = require('express').Router()
const userController = require('../controllers/userController')
const { authenticate } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/middleware')

// router.get("/:id", userController.getMe)
router.post('/signup', upload.single("image"), userController.signUp)

router.post('/:id/follow', authenticate, userController.follow)



module.exports = router