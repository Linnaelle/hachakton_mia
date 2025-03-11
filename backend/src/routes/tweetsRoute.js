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
  
router.post('/:id/like', (req, res) => { res.json({msg: 'like a tweet'}) })
router.delete('/:id/like', (req, res) => { res.json({msg: 'unlike a tweet'}) })
router.post('/:id/retweet', (req, res) => { res.json({msg: 'retweet a tweet'}) })
// Route pour récupérer le fil d’actualité
// router.get("/timeline", authMiddleware, getHomeTimeline)
router.get("/timeline", (req, res) => {})
// Route pour créer un tweet avec upload de fichier
// router.post("/tweets", authMiddleware, upload.single("media"), createTweet);

module.exports = router