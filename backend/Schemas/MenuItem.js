const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: { 
    type: String,
     required: true 
    },

    image: { type: String, required: true }, // New field to store image URL or path
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
