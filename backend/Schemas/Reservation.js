const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserSchema", required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
  date: { type: Date, required: true },
  startHour: { type: Number, required: true },
  people: { type: Number, required: true },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
