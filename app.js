// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalized = require("./utils/capitalized");
const projectName = "online-game-store";

app.locals.appTitle = `${capitalized(projectName)} created with IronLauncher`;

// import bcryptjs for password hashing

// Session initializing and config

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: (1000 * 60 * 60 * 24)},
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
        })
    })
)

// passport import and configuration

const User = require('./models/User.model')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
	done(null, user._id)
})

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(user => {
			done(null, user)
		})
		.catch(err => {
			done(err)
		})
})

passport.use((
	new LocalStrategy((username, password, done) => {
		// this logic will be executed when we log in
		User.findOne({ username: username })
			.then(user => {
				if (user === null) {
					// username is not correct
					done(null, false, { message: 'Wrong Credentials' })
				} else { // THIS WORKS ! THIS CHECKS FOR THE PASSWORD AGAINST THE HASH
                    if (bcryptjs.compareSync(password, user.password)) {
                        done(null, user)
                    }
                    else {
                        done(null,false, { message: 'Wrong Credetnials'})
                    }
				}
			})
	})
))

// 👇 Start handling routes here
const index = require("./routes");
app.use("/", index);

const auth = require("./routes/auth")
app.use('/auth', auth)




// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
