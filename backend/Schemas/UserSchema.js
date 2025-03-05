const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  // profilePicture: String,
  username: String, birthDate: String, address: String, phoneNumber: String, photo: String,
  role: { type: String, default: "user" },
});

module.exports = mongoose.model("users", UserSchema);
