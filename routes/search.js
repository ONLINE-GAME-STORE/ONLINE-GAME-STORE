const router = require("express").Router();
const Game = require("../models/Game");

router.get("/", (req, res, next) => {
  const query = req.query.q;
  console.log(query);
  Game.find( { name : { '$regex' : query, '$options' : 'i' } } )
    .then((foundGames) => {
      res.render('search', {foundGames});
    })
    .catch((err) => console.log(err));
});

module.exports = router;
