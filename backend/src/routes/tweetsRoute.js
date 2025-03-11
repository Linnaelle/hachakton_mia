const router = require('express').Router()

// definitions des endpoints pour les tweets

router.get('/', (req, res) => { res.json({msg: 'lall tweets'}) })
router.post(':id/like', (req, res) => { res.json({msg: 'like a tweet'}) })
router.delete(':id/like', (req, res) => { res.json({msg: 'unlike a tweet'}) })
router.post(':id/comment', (req, res) => { res.json({msg: 'comment a tweet'}) })
router.post(':id/retweet', (req, res) => { res.json({msg: 'retweet a tweet'}) })
// Route pour récupérer le fil d’actualité
// router.get("/timeline", authMiddleware, getHomeTimeline)
router.get("/timeline", (req, res) => {})
// Route pour créer un tweet avec upload de fichier
// router.post("/tweets", authMiddleware, upload.single("media"), createTweet);

module.exports = router