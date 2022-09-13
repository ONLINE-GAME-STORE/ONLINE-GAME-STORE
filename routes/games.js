const router = require("express").Router();
const Game = require("../models/Game");
const { loginCheck } = require("../utils/authenticatorFuncitions");
const {
  ifLoggedInRedirectToDash,
} = require("../utils/authenticatorFuncitions");
const uploader = require("../config/cloudinary");
const User = require("../models/User");

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


// should be protected route
router.get("/add", loginCheck(), (req, res, next) => {
  res.render("Games/add");
});

router.post(
  "/add",
  loginCheck(),
  uploader.single("posterUrl"),
  (req, res, next) => {
    const loggedInUserId = req.user.id;
    const { name, author, description, gameLink } = req.body;
    const posterUrl = req.file.path;
    Game.create({
      name,
      author,
      description,
      gameLink,
      posterUrl,
      userAdded: loggedInUserId,
    })
      .then((newGame) => {
				console.log(newGame)
				return User.findByIdAndUpdate(loggedInUserId, {
					$push : {games : newGame.id}
					
				}, {new:true})
				.then(updatedUser => {
					console.log(updatedUser)
					res.redirect("/games/" + newGame.id);
				})
				.catch((err) => console.log(err))
      })
      .catch((err) => console.log(err));
  }
);

// protected route only for user who added the game

router.get("/:id/edit", loginCheck(), (req, res, next) => {
  const gameId = req.params.id;
  const loggedInUserId = req.user.id;
  Game.findById(gameId)
    .populate("userAdded")
    .then((game) => {
      if (game.userAdded.id !== loggedInUserId) {
        res.redirect("/games/" + gameId);
      } else {
        res.render("games/edit", { game });
      }
    });
});

router.post(
  "/:id/edit",
  loginCheck(),
  uploader.single("posterUrl"),
  (req, res, next) => {
    const gameId = req.params.id;
    const loggedInUserId = req.user.id;

    Game.findById(gameId)
      .populate("userAdded")
      .then((game) => {
        if (game.userAdded.id !== loggedInUserId) {
          res.redirect("/games/" + gameId);
        } else {
          
					// JUST IN CASE IF LATER HAVE BUGS UNCOMMENT
          // if (req.body.name) {
          //   newObj.name = req.body.name;
          // } else {
          //   newObj.name = game.name;
          // }
          // if (req.body.author) {
          //   newObj.author = req.body.author;
          // } else {
          //   newObj.author = game.author;
          // }
          // if (req.body.description) {
          //   newObj.description = req.body.description;
          // } else {
          //   newObj.description = game.description;
          // }
          // if (req.body.gameLink) {
          //   newObj.gameLink = req.body.gameLink;
          // } else {
          //   newObj.gameLink = game.gameLink;
          // }
					const newObj = {...req.body}
          if (req.file) {
            newObj.posterUrl = req.file.path;
          } else {
            newObj.posterUrl = game.posterUrl;
          }
					console.log(newObj)
          Game.findByIdAndUpdate(
            gameId,
            {
              ...newObj,
            },
            { new: true }
          )
            .then((updatedGame) => {
              console.log(updatedGame);
              res.redirect("/games/" + gameId);
            })
            .catch((err) => console.log(err));
        }
      });
  }
);


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
		
		
module.exports = router;
