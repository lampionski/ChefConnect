const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Secret key for JWT signing (move to environment variables in production)
const JWT_SECRET = "your_secret_key"; // Replace this with an env variable in production

// ========================
// Authentication Routes
// ========================

// Register route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please provide all required fields: name, email, and password" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // Default role
    });

    await newUser.save();

    res.sendStatus(201)
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// ========================
// User-Related Routes
// ========================

// Example: Get user profile
router.get("/profile", async (req, res) => {
  // Assuming user ID is extracted from a middleware
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Middleware for token verification (optional, for routes requiring authentication)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role; // Useful for role-based logic
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid token." });
  }
};

// Example: Route protected by token verification
router.get("/admin", verifyToken, (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }

  res.status(200).json({ message: "Welcome, Admin!" });
});

module.exports = router;




// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const router = express.Router();

// // Secret key for JWT signing (you should move this to environment variables in a real app)
// const JWT_SECRET = 'your_secret_key';  // Keep this secret

// // Register route
// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   // Check if required fields are provided
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'Please provide all required fields: name, email, and password' });
//   }

//   try {
//     // Check if the email is already in use
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: 'Email already in use' });
//     }

//     // Hash the password using bcrypt
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create a new user
//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'user' // Default role
//     });

//     // Save the new user to the database
//     await newUser.save();

//     // Return success response with user details (exclude password for security)
//     res.status(201).json({
//       message: 'User registered successfully',
//       user: { name: newUser.name, email: newUser.email }
//     });
//   } catch (err) {
//     console.error('Error during registration:', err);
//     res.status(500).json({ error: 'Server error', details: err.message });
//   }
// });

// // Signin route with JWT
// router.post('/signin', async (req, res) => {
//   const { email, password } = req.body;

//   // Check if both email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Please provide both email and password' });
//   }

//   try {
//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Create a JWT token
//     const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

//     // Send the token back to the client (frontend)
//     res.status(200).json({
//       message: 'Login successful',
//       user: { name: user.name, email: user.email, role: user.role },
//       token // Send the JWT token to the frontend
//     });
//   } catch (err) {
//     console.error('Error during login:', err);
//     res.status(500).json({ error: 'Server error', details: err.message });
//   }
// });

// module.exports = router;
