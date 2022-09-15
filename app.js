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
const projectName = "IronGames";

app.locals.appTitle = projectName;

// import bcryptjs for password hashing
const bcrypt = require("bcryptjs");
// Session initializing and config

const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// passport import and configuration

const User = require("./models/User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    // this logic will be executed when we log in
    User.findOne({ username: username }).then((user) => {
      if (user === null) {
        // username is not correct
        done(null, false, { message: "Wrong Credentials" });
      } else {
        // THIS WORKS ! THIS CHECKS FOR THE PASSWORD AGAINST THE HASH
        if (bcrypt.compareSync(password, user.password)) {
          done(null, user);
        } else {
          done(null, false, { message: "Wrong Credentials" });
        }
      }
    });
  })
);

// DEFINE THE NEW GITHUB STRATEGY

const GithubStrategy = require("passport-github").Strategy;

passport.use(
  new GithubStrategy(
    {
      // HERE YOU NEED TO GO TO GITHUB AND AUTHORIZE YOUR APP
      // careful what you put here everything should match
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({
        githubId: profile.id,
      }).then((user) => {
        if (user !== null) {
          // pass the user to passport to serialize it
          done(null, user);
        } else {
          User.create({
            githubId: profile.id,
            username: profile.username,
            profilePicPath: profile._json.avatar_url,
            githubLink: profile._json.html_url,
          }).then((user) => {
            done(null, user);
          });
        }
      });
    }
  )
);


// Use express-sessions and passport to handle user's sessions
app.use(passport.initialize());
app.use(passport.session());
//End

// 👇 Start handling routes here
const index = require("./routes");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/auth", auth);

const games = require("./routes/games");
app.use("/games", games);

const search = require("./routes/search");
app.use("/search", search);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
