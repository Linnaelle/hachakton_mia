const router = require('express').Router()
const userController = require('../controllers/userController')
const { authenticateJWT } = require('../middlewares/authMiddleware')
const { upload } = require('../middlewares/middleware')

// router.get("/:id", userController.getMe)
router.post('/signup', upload.single("image"), userController.signUp)

router.post('/:id/follow', authenticateJWT, userController.follow)

router.put('/update', upload.single("image"), userController.edit)


module.exports = router