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
      callbackURL: "https://oscar-funny-likewise-navigation.trycloudflare.com/auth/github/callback",
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

const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "https://oscar-funny-likewise-navigation.trycloudflare.com/auth/facebook/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    // console.log('facebook profile is',profile)
    User.findOne({
      facebookId: profile.id,
    }).then(user => {
      if (user !== null) {
        done(null, user);
      } else {
        User.create({
          facebookId: profile.id,
          username: profile.displayName,
        }).then(user => {
          done(null, user);
        })
      }
    })
    
  })
)

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "https://oscar-funny-likewise-navigation.trycloudflare.com/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    // console.log('google profile is',profile)
    User.findOne({
      googleId: profile.id,
    }).then(user => {
      if (user !== null) {
        done(null, user);
      } else {
        User.create({
          googleId: profile.id,
          username: profile.displayName,
          profilePicPath: profile._json.picture,
        }).then(user => {
          done(null, user);
        })
      }
    })
  })
)



import('passport-reddit')
  .then(module => {
    passport.use(
      new module.Strategy({
        clientID: process.env.REDDIT_ID,
        clientSecret: process.env.REDDIT_SECRET,
        callbackURL: "https://oscar-funny-likewise-navigation.trycloudflare.com/auth/reddit/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('reddit profile is',profile)
        User.findOne({
          redditId: profile.id, 
        }).then(user => {
          if (user !== null) {
            done(null, user);
          } else {
            User.create({
              redditId: profile.id,
              username: profile._json.name,
              profilePicPath: profile._json.icon_img,
            }).then(user => {
              done(null, user);
            })
          }
        })
      })
    );

  })




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
