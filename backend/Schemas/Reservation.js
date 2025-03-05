const mongoose = require("mongoose")

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startHour: {
    type: Number,
    required: true,
  },
  people: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Reservation", ReservationSchema)

