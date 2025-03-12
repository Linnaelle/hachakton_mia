const router = require('express').Router()
const tweetController = require('../controllers/tweetController')
const { upload } = require('../utils/uploads')
const { authenticateJWT } = require('../middlewares/authMiddleware')

// definitions des endpoints pour les tweets

// Route pour récupérer le fil d’actualité
// router.get("/timeline", authMiddleware, getHomeTimeline)
router.get('/', authenticateJWT, tweetController.getTimeline)
router.post('/', authenticateJWT, upload.single('media'), tweetController.createTweet)
router.delete('/:id', authenticateJWT, tweetController.deleteTweet)
// route pour commenter un tweet
router.post('/:id/comment', authenticateJWT, tweetController.comment)
// recuperer un tweet et les comment associes
router.get('/:id', tweetController.getTweet)
// router pour liker un tweet et unliker un tweet
router.post('/:id/like', authenticateJWT, tweetController.likeTweet)
// route pour retweeter
router.post('/:id/retweet', authenticateJWT, tweetController.reTweet)

router.get('/all', tweetController.getAllTweets)

module.exports = router