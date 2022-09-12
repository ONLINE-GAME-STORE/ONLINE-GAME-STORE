const router = require("express").Router();
const Game = require("../models/User");

router.get("/", (req, res, next) => {
  res.send("hello from games index page");
});

// should be protected route
router.get("/add", (req, res, next) => {
  res.send("hello from games adding page");
});

router.post("/add", (req, res, next) => {
	// add here protection, taking the user and adding it as reference,
	// uploading the image
	const {name, author} = req.body
  Game.create({
		name: name,
		author: author,
	});
});

router.get("/:id", (req, res, next) => {
  res.send("hello from a game details page");
});

// protected route only for user who added the game

router.get("/:id/edit", (req, res, next) => {
  res.send("hello from a game edit page");
});

module.exports = router;
