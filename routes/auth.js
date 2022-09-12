const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const passport = require('passport')



router.get('/signup', (req,res,next) => {
    res.send('Hello from signup page')
})

router.post("/signup", (req,res,next) => {
	const { username, password } = req.body

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
    
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB !== null) {
				res.render('signup', { message: 'Username is alredy taken' })
			} else {
				// we can use that username
				// and hash the password
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
						// if we want to log the user in using passport
						// req.login()
						res.redirect('/login')
					})
					.catch(err => next(err))
			}
		})
});

router.get('/login', (req,res,next) => {
    res.send('Hello from login page')
})

router.post('/login', passport.authenticate('local', {
	successRedirect: '/profile',
	failureRedirect: '/login'
}));

module.exports = router