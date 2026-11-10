const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullname: String,
  email: { type: String, required: true, trim: true, lowercase: true },
  password: String,
  // profilePicture: String,
  username: String, birthDate: String, address: String, phoneNumber: String, photo: String,
  role: { type: String, enum: ["user", "worker", "admin"], default: "user" },
  tokenVersion: { type: Number, default: 0 },
});
UserSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

module.exports = mongoose.model("users", UserSchema);
