const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    name: String,
    author: String,
    posterUrl: String,
    description: String,
    userAdded: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviews: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Game = model("Game", gameSchema);

module.exports = Game;
