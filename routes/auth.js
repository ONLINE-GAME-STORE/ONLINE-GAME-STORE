const router = require('express').Router();

router.get('/signup', (req,res,next) => {
    res.send('Hello from signup page')
})

router.post('/signup', (req,res,next) => {
    res.send('Hello from signup post.')
})

module.exports = router