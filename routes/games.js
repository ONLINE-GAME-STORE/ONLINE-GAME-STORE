const router = require("express").Router();
const Game = require("../models/Game");

// GAME INDEX (LIBRARY)
router.get("/", (req, res, next) => {
//   res.send("Game-Library");
  Game.find()
.then(gameFromDB => {
	console.log(gameFromDB)
	res.render("games/index", {gameList: gameFromDB})
})
.catch(err => next(err))
});

// GAME DETAILS 
router.get("/:id", (req, res, next) => {
	// res.send("Chosen-Game 👾")
	const id = req.params.id 
	Game.findById(id)
	// REVIEWS -> showing only Username (who wrote the review) and the review 
	.populate({
		path: "reviews",
		// options: {
		// 	limit: 5
		// },
		populate: {
			path: "user",
			// options: {
			// 	limit: 5 
			// }
		}
	})
	.then(gameFromDB => {
		// res.send(gameFromDB)
		const fiveReviews = gameFromDB.reviews.slice(0, 5)
		res.render("games/details", {gameDetail: gameFromDB, fiveReviews})
	})
	.catch(err => (err))
})

// REVIEWS PAGE 
router.get("/:id/reviews", (req, res, next) => {
	// res.send("Reviews ⭐️")
	const id = req.params.id 
	Game.findById(id)
	.populate({
		path: "reviews",
		populate: {
			path: "user"
		}
	})
	.then (reviewFromDB => {
		res.render("games/reviews", { gameReviews: reviewFromDB})
	})
	.catch(err => (err))
})

// REVIEW POST -> Uploading review to the DB 
router.post("/:id", (req, res, next) => {
	const id = req.params.id
	const review = req.body.review 
	const user = req.user
	Game.findByIdAndUpdate(id, {$push: {reviews: {user: user, text: review}}})
	.then(gameFromDB => {
		res.redirect(id) 
	})
	.catch(err => (err))
})


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
	})
	.then(newGame => console.log(newGame))
	.catch(err => console.log(err))
});


router.get("/:id", (req, res, next) => {
  res.send("hello from a game details page");
});

// protected route only for user who added the game

router.get("/:id/edit", (req, res, next) => {
  res.send("hello from a game edit page");
});

module.exports = router;
