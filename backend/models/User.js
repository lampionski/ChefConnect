const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
      trim: true // Automatically trims the email field
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }, // Default role is 'user'
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Trim email before saving it
userSchema.pre('save', function(next) {
  this.email = this.email.trim(); // Trims spaces from email
  next();
});

// Create the model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
