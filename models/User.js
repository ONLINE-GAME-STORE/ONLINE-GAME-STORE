const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      // unique: true -> Ideally, should be unique, but its up to you
    },
    password: String,
    githubLink: String,
    githubId: String,
    facebookId: String,
    googleId: String,
    profilePic: String,
    profilePicPath: String,
    games: [{
      type: Schema.Types.ObjectId,
      ref: "Game"
    }]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
