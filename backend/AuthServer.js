const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const gatherUserInfo = require("./Middlewares/gatherUserInfo")

const UserSchema = require("./Schemas/UserSchema");
const MenuItem = require("./Schemas/MenuItem");

const app = express();

// Predefined categories
const categories = ["Salad", "Pizza", "Pasta", "Seafood", "Desserts", "Drinks"];

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// Get user profile
app.get("/user-profile", gatherUserInfo, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user._id)
      .select("-password") // Exclude password from the response
      .lean(); // Convert to plain JavaScript object
    
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send all user data except password
    res.json({
      fullname: user.fullname,
      email: user.email,
      username: user.username || user.fullname, // Use fullname as fallback
      birthDate: user.birthDate || "",
      photo: user.photo || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
});

// Update user profile
app.post("/update-profile", gatherUserInfo, async (req, res) => {
  try {
    const { username, birthDate, address, phoneNumber, photo } = req.body;
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.user._id,
      { username, birthDate, address, phoneNumber, photo },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user profile:", err.message);
    res.status(500).json({ message: "Failed to update user profile." });
  }
});

// Change password
app.post("/change-password", gatherUserInfo, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserSchema.findByIdAndUpdate(req.user._id, { password: hashedPassword });
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error changing password:", err.message);
    res.status(500).json({ message: "Failed to change password." });
  }
});

app.get("/user", gatherUserInfo, async (req, res) => {
  const user = {
    email: req.user.email,
    fullname: req.user.fullname,
    letter: req.user.letter,
    class: req.user.class,
    classNumber: req.user.classNumber,
    role: req.user.role,
  };
  res.json(user);
});

// User Registration
app.post("/register", async (req, res) => {
  const { email, password, fullname } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password || !fullname) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  try {
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserSchema({ email, password: hashedPassword, fullname });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Failed to register user." });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password." });
  }

  try {
    const fetchedUser = await UserSchema.findOne({ email });

    if (!fetchedUser || !(await bcrypt.compare(password, fetchedUser.password))) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const accessToken = jwt.sign(
      { uid: fetchedUser._id.toString() },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { uid: fetchedUser._id.toString() },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "10d" }
    );

    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refToken", refreshToken, { httpOnly: true });
    res.status(200).json({ message: "Login successful." });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Failed to log in." });
  }
});

//log out 
app.get('/logout', async (req, res) => {
  const reftoken = req.cookies['refToken'];
  console.log(reftoken)

  if (reftoken) {
    res.clearCookie('refToken', {
      httpOnly: true
    });
    res.clearCookie('accessToken',{
      httpOnly: true
    });
    res.status(200).json({ message: "Logged out successfully." });
  } else {
    res.status(400).json({ message: "No refresh token found." });
  }
});

// Get Categories
app.get("/get-categories", (req, res) => {
  res.status(200).json(categories);
});

// Get Menu Items
app.get("/get-menu", async (req, res) => {
  const { category } = req.query;
  try {
    const filter = category ? { category } : {};
    const menuItems = await MenuItem.find(filter);
    res.status(200).json(menuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err.message);
    res.status(500).json({ message: "Failed to fetch menu items." });
  }
});

// Add Menu Item
app.post("/add-menu-item", async (req, res) => {
  const { name, description, price, category, image } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid category." });
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Invalid price." });
  }

  try {
    const newItem = new MenuItem({ name, description, price, category, image });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error adding menu item:", err.message);
    res.status(500).json({ message: "Failed to add menu item." });
  }
});

// Update Menu Item
app.put("/update-menu-item/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;

  try {
    if (price && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ message: "Invalid price." });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price, category, image },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    res.json(updatedItem);
  } catch (err) {
    console.error("Error updating menu item:", err.message);
    res.status(500).json({ message: "Failed to update menu item." });
  }
});

// Delete Menu Item
app.delete("/delete-menu-item/:id", async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.status(200).json({ message: "Item deleted.", item: deletedItem });
  } catch (err) {
    console.error("Error deleting menu item:", err.message);
    res.status(500).json({ message: "Failed to delete menu item." });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
