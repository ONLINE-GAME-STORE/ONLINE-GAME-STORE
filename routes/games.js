const router = require("express").Router();
const Game = require("../models/Game");
const {loginCheck} = require("../utils/authenticatorFuncitions");
const {ifLoggedInRedirectToDash} = require("../utils/authenticatorFuncitions")
const uploader = require('../config/cloudinary')

router.get("/", (req, res, next) => {
  res.send("hello from games index page");
});

// should be protected route
router.get("/add", loginCheck(), (req, res, next) => {
  res.render('Games/add');
});

router.post("/add", loginCheck(), uploader.single('posterUrl'), (req, res, next) => {
	const loggedInUser = req.user;
	const loggedInUserId = req.user.id
	const {name, author, description, gameLink} = req.body
	const posterUrl = req.file.path
  Game.create({
		name,
		author,
		description,
		gameLink,
		posterUrl,
		userAdded: loggedInUserId,
	})
	.then(newGame => {
		console.log(newGame)
		res.redirect('/games/' + newGame.id)
	})
	.catch(err => console.log(err))
});

router.get("/:id", (req, res, next) => {
  res.send("hello from a game details page");
});


// protected route only for user who added the game

router.get("/:id/edit", loginCheck(), (req, res, next) => {
	const gameId = req.params.id;
	const loggedInUserId = req.user.id
	Game.findById(gameId).populate('userAdded')
	.then(game => {
		if (game.userAdded.id !== loggedInUserId) {
			res.redirect('/games/' + gameId)
		} else {
			res.render('games/edit', {game})
		}
	})
});

router.post("/:id/edit", loginCheck(), uploader.single('posterUrl'), (req,res,next) => {
	const gameId = req.params.id;
	const loggedInUserId = req.user.id;

	Game.findById(gameId).populate('userAdded')
	.then(game => {
		if (game.userAdded.id !== loggedInUserId) {
			res.redirect('/games/' + gameId)
		} else {
			const newObj = {};
			if (req.body.name) {
				newObj.name = req.body.name
			} else {
				newObj.name = game.name
			}
			if (req.body.author) {
				newObj.author = req.body.author
			} else {
				newObj.author = game.author
			}
			if (req.body.description) {
				newObj.description = req.body.description;
			} else {
				newObj.description = game.description;
			}
			if (req.body.gameLink) {
				newObj.gameLink = req.body.gameLink
			} else {
				newObj.gameLink = game.gameLink
			}
			if (req.file) {
				newObj.posterUrl = req.file.path;
			} else {
				newObj.posterUrl = game.posterUrl;
			}
			Game.findByIdAndUpdate(gameId, {
				...newObj
			}, {new:true})
			.then(updatedGame => {
				console.log(updatedGame)
				res.redirect('/games' + gameId)
			})
			.catch(err => console.log(err))
		}
	})
})

module.exports = router;
