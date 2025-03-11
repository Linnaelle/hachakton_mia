const router = require('express').Router()
const tweetController = require('../controllers/tweetController')
const { upload } = require('../utils/uploads')
const { authenticate } = require('../middlewares/authMiddleware')

// definitions des endpoints pour les tweets

router.get('/', tweetController.getAllTweets)
router.post('/', authenticate, upload.single('media'), tweetController.createTweet)
router.delete('/:id', authenticate, tweetController.deleteTweet)
// route pour commenter un tweet
router.post('/:id/comment', authenticate, tweetController.comment)
// recuperer un tweet et les comment associes
router.get('/:id', tweetController.getTweet)
// router pour liker un tweet et unliker un tweet
router.post('/:id/like', authenticate, tweetController.likeTweet)
// route pour retweeter
router.post('/:id/retweet', authenticate, tweetController.reTweet)
// Route pour récupérer le fil d’actualité
// router.get("/timeline", authMiddleware, getHomeTimeline)
router.get("/timeline", (req, res) => {})

module.exports = router