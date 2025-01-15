const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  profilePicture: String,
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("users", UserSchema);
