const mongoose = require("mongoose")

const ContactMessage = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model("ContactMessage", ContactMessage)
