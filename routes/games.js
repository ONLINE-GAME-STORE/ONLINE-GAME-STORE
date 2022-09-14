const router = require("express").Router();
const Game = require("../models/Game");
const { loginCheck } = require("../utils/authenticatorFuncitions");
const {
  ifLoggedInRedirectToDash,
} = require("../utils/authenticatorFuncitions");
const uploader = require("../config/cloudinary");
const User = require("../models/User");
const { populate } = require("../models/Game");

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
	const id = req.params.id 
	const loggedInUserId = req.user.id
  // const averageRating = req.user.rating
	let sameUserCheck = false
	Game.findById(id)
	.populate('userAdded')
	// REVIEWS -> showing only Username (who wrote the review) and the review 
  // .populate({
  //   path: "rating"
  // })
	.populate({
		path: "reviews",
		// options: {
			// 	limit: 5
			// },
			populate: {
				path: "user"
				// options: {
					// 	limit: 5 
					// }
          // populate: {
          //   rating: "user"
          // }
				}
			})
			.then(gameFromDB => {
				console.log(gameFromDB.userAdded.id)
				console.log(loggedInUserId)
				if (gameFromDB.userAdded.id === loggedInUserId) {
					sameUserCheck = true
				}
        // AVERAGE FUCKING RATING AND ITS PISSING ME OF 

				const fiveReviews = gameFromDB.reviews.slice(0, 5)
        let allRatings = gameFromDB.reviews.map(objc => objc.rating)
        let averageRating; 
        let sum = 0;
        for (let number of allRatings) {
            sum += number;
        }
        averageRating = Math.floor(sum / allRatings.length)
        // console.log(averageRating)
        // IF CONDITION FOR STARS (AVERAGE RATING)
        let averageRatingStar; 
        if(averageRating === 1){
          averageRatingStar = "⭐️"
        } else if (averageRating === 2){
          averageRatingStar = "⭐️⭐️"
        } else if (averageRating === 3){
          averageRatingStar = "⭐️⭐️⭐️"
        } else  if (averageRating === 4){
          averageRatingStar = "⭐️⭐️⭐️⭐️"
        } else {
          averageRatingStar = "⭐️⭐️⭐️⭐️⭐️"
        }

        res.render("games/details", {gameDetail: gameFromDB, fiveReviews, sameUserCheck, averageRatingStar})
			})
			.catch(err => (err))
		})
		
// REVIEW POST -> Uploading review to the DB 
router.post("/:id", (req, res, next) => {
	const id = req.params.id
	const review = req.body.review 
  const valueRating = req.body.rate 
	const user = req.user
	Game.findByIdAndUpdate(id, {$push: {reviews: {user: user, text: review, rating: valueRating}}})
	.then(gameFromDB => {
		res.redirect(id) 
	})
	.catch(err => (err))
})

// STAR RATING POST 
router.post("/:id/star-rating", (req, res, next) => {
  const id = req.params.id
  const valueRating = req.body.rate 
  const user = req.user 
  Game.findByIdAndUpdate(id, {$push: {reviews: {user: user, rating: valueRating}}})
  .then(star => {
    res.redirect(id)
  })
  .catch(err =>(err))
})

router.get("/:id/star-rating", (req, res, next) => {
  // res.send("hello") 
  const id = req.params.id 
	Game.findById(id)
	.populate({
		path: "rating",
		populate: {
			path: "user"
		}
	})
	.then (ratingFromDB => {
    const reviews = ratingFromDB.reviews.map(review => review.rating)
		res.render("games/star-rating", { gameStarRating: reviews})
	})
	.catch(err => (err))
})
		
		
module.exports = router;
