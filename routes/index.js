const router = require("express").Router();
const User = require('../models/User')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/dashboard', (req,res,next) => {
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
