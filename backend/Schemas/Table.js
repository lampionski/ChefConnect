const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  capacity: { type: Number, required: true },
});

module.exports = mongoose.model("Table", TableSchema);
