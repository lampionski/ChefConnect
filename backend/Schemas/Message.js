const mongoose = require("mongoose");

const Message = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, default: "text" },
  reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation" }
});

module.exports = mongoose.model("message", Message);
