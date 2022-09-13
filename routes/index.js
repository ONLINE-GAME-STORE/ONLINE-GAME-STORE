const router = require("express").Router();
const User = require('../models/User')
const {loginCheck} = require('../utils/authenticatorFuncitions')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/dashboard', loginCheck(), (req,res,next) => {
  let sameUserCheck = true;
  User.findById(req.user.id).populate('games')
  .then(loggedInUser => {
    res.render('dashboard', {loggedInUser, sameUserCheck})
  })
})

router.get('/dashboard/:id', (req,res,next) => {
  let sameUserCheck = false
  const userId = req.params.id;
  if (req.user && req.user.id === userId) {
    sameUserCheck = true
  }
  User.findById(userId).populate('games')
  .then(loggedInUser => res.render('dashboard', {loggedInUser, sameUserCheck}))
  .catch(err => console.log(err))
})

module.exports = router;
