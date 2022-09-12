const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
const loginCheck = require("../utils/authenticatorFuncitions");


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  // ADD HERE SOME PASSWORD VALIDATION LATER
  // is the password + 4 chars
  // if (password.length < 4) {
  // 	res.render('signup', { message: 'Your password needs to be min 4 chars' })
  // 	return
  // }
  // if (username.length === 0) {
  // 	res.render('signup', { message: 'Your username cannot be empty' })
  // 	return
  // }
  // validation passed
  // do we already have a user with that username in the db?

  User.findOne({ username: username }).then((userFromDB) => {
    if (userFromDB !== null) {
      res.render("signup", { message: "Username is alredy taken" });
    } else {
      // we can use that username
      // and hash the password
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      // create the user
      User.create({ username, password: hash })
        .then((createdUser) => {
          console.log(createdUser);
          // if we want to log the user in using passport
          // req.login()
          res.redirect("/login");
        })
        .catch((err) => next(err));
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

//must be protected only the user himself can see this page
//otherwise redirect
router.get("/edit/:id", loginCheck(), (req, res, next) => {
  const userId = req.params.id;
  const loggedInUser = req.user;
  if (req.user.id === userId) {
    res.render("auth/edit", { loggedInUser });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
