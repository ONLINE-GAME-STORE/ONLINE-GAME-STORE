// General authentication check - checks for ANY user

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

module.exports = loginCheck;