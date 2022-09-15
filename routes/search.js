const router = require("express").Router();
const Game = require("../models/Game");

router.get("/", (req, res, next) => {
  const query = req.query.q;
  Game.find( { name : { '$regex' : query, '$options' : 'i' } } )
    .then((foundGames) => {
      res.render('search', {foundGames, query});
    })
    .catch((err) => console.log(err));
});

module.exports = router;
