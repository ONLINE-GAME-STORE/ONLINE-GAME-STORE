const {Schema, model} = require('mongoose');

const gameSchema = new Schema(
    {
        name: String,
        author: String,
        posterUrl: String,
        description: String,
        reviews: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            text: String
        }]
})

const Game = mongoose.model('Game', gameSchema)
module.exports = Game;