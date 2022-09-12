const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/dashboard', (req,res,next) => {
  const loggedInUser = req.user;
  res.render('dashboard', {loggedInUser})
})

module.exports = router;
