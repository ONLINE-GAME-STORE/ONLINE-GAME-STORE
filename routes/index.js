const router = require("express").Router();
const User = require('../models/User')
const {loginCheck} = require('../utils/authenticatorFuncitions')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/dashboard', loginCheck(), (req,res,next) => {
  const loggedInUser = req.user;
  res.render('dashboard', {loggedInUser})
})

router.get('/dashboard/:id', (req,res,next) => {
  const userId = req.params.id;
  User.findById(userId)
  .then(loggedInUser => res.render('dashboard', {loggedInUser}))
  .catch(err => console.log(err))
})

module.exports = router;
