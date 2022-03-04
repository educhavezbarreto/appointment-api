const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  image: String,
  accessToken: String,
  refreshToken: String,
  email: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
