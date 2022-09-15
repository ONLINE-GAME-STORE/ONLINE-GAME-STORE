// General authentication check - checks for ANY user
// Use to protect routes that should be for logged in users only

function loginCheck() {
  return (req, res, next) => {
    // check if the user is logged in
    if (req.user !== undefined) {
      // the user is logged in
      // they can visit the page that they requested
      next();
    } else {
      // the user is not logged in
      // we redirect
      res.redirect("/auth/login");
    }
  };
}

// Use to protect routes that should be accessible only if there's no logged in user

function ifLoggedInRedirectToDash() {
  return (req, res, next) => {
    if (req.user === undefined) {
      next();
    } else {
      res.redirect("/dashboard/" + req.user._id);
    }
  };
}

module.exports = { loginCheck, ifLoggedInRedirectToDash };
