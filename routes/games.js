const router = require('express').Router();

router.get('/', (req,res,next) => {
    res.send('hello from games index page')
})

router.get('/add', (req,res,next) => {
    res.send('hello from games adding page')
})

router.get('/:id', (req,res,next) => {
    res.send('hello from a game details page')
})

router.get('/:id/edit', (req,res,next) => {
    res.send('hello from a game edit page')
})




module.exports = router