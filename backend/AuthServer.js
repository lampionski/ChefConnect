const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config(); //load the .env file
const gatherUserInfo = require("./Middlewares/gatherUserInfo");

const adminRoutes = require('./routes/adminRoutes');

const UserSchema = require("./Schemas/UserSchema");
const MenuItem = require("./Schemas/MenuItem");
const Reservation = require("./Schemas/Reservation");
const Message = require("./Schemas/Message");
const ContactMessage = require("./Schemas/ContactMessage");
const adminCheck = require("./Middlewares/adminCheck");
const { uploadDir, parseMenuImage, saveMenuImage, removeMenuImage } = require('./menuImages');

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

//  categories
const categories = ["Салата", "Специалитети", "Предястия и Разядки", "Барбекю", "Паста и Ризото", "Риба и Морски Дарове",
  "Бургери и Тортила","Супи" , "Десерти", "Хлебчета", "Сосове", "Напитки"];

const allowedOrigins = isProduction
  ? ["https://chefconnectbg.vercel.app"]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];
const validPassword = (value) => typeof value === "string" && value.length >= 8 && value.length <= 128 && /\d/.test(value) && /[!@#$%^&*]/.test(value);
const validMenuItem = ({ name, description, price, category, image = '' }) =>
  typeof name === 'string' && !!name.trim() && name.length <= 120 &&
  typeof description === 'string' && !!description.trim() && description.length <= 2000 &&
  typeof image === 'string' && image.length <= 2000 && categories.includes(category) &&
  Number.isFinite(Number(price)) && Number(price) > 0 && Number(price) <= 10000;
const removeUnusedMenuImage = async (image) => {
  if (image && !(await MenuItem.exists({ image }))) await removeMenuImage(image);
};

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use('/uploads/menu', express.static(uploadDir, { dotfiles: 'deny', maxAge: '1d' }));
app.use((req, res, next) => {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method) || !req.headers.origin || allowedOrigins.includes(req.headers.origin)) return next();
  return res.status(403).json({ message: "Origin not allowed" });
});

app.use('/admin', adminRoutes);

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body
  if (typeof name !== "string" || !name.trim() || name.length > 100 || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof message !== "string" || !message.trim() || message.length > 5000) {
    return res.status(400).json({ message: "Invalid contact details" })
  }
  try {
    await ContactMessage.create({ name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() })
    res.status(201).json({ message: "Message saved" })
  } catch (error) {
    console.error("Error saving contact message:", error)
    res.status(500).json({ message: "Failed to save message" })
  }
})

// Get all messages
app.get("/messages", gatherUserInfo, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id }).populate('sender', 'fullname photo').sort({ createdAt: -1 });
    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Error fetching messages" })
  }
})

// Delete a message
app.delete("/messages/:id", gatherUserInfo, async (req, res) => {
  try {
    await Message.deleteOne({ receiver: req.user._id, _id: req.params.id });
    res.json(true);
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Error fetching messages" })
  }
})

// Get user profile
app.get("/user-profile", gatherUserInfo, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user._id).select("-password").lean()

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    res.json({
      fullname: user.fullname,
      email: user.email,
      username: user.username || user.fullname,
      birthDate: user.birthDate || "",
      photo: user.photo || "",
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role,
    })
  } catch (err) {
    console.error("Error fetching user profile:", err.message)
    res.status(500).json({ message: "Failed to fetch user profile." })
  }
})

// Update user profile
app.post("/update-profile", gatherUserInfo, async (req, res) => {
  try {
    const { username, birthDate, address, phoneNumber, photo } = req.body
    if ([username, birthDate, address, phoneNumber, photo].some((value) => typeof value !== "string") ||
      username.length > 80 || address.length > 250 || phoneNumber.length > 40 ||
      (photo && (!/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=]+$/i.test(photo) || photo.length > 700000))) {
      return res.status(400).json({ message: "Invalid profile data." })
    }
    const updatedUser = await UserSchema.findByIdAndUpdate(
      req.user._id,
      { username, birthDate, address, phoneNumber, photo },
      { new: true },
    ).select("-password")
    res.json(updatedUser)
  } catch (err) {
    console.error("Error updating user profile:", err.message)
    res.status(500).json({ message: "Failed to update user profile." })
  }
})

// Change password
app.post("/change-password", gatherUserInfo, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (typeof currentPassword !== "string" || !validPassword(newPassword)) {
      return res.status(400).json({ message: "Invalid password." })
    }
    if (!(await bcrypt.compare(currentPassword, req.user.password))) {
      return res.status(400).json({ message: "Current password is incorrect." })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await UserSchema.findByIdAndUpdate(req.user._id, { password: hashedPassword, $inc: { tokenVersion: 1 } })
    res.clearCookie("accessToken", authCookieOptions)
    res.clearCookie("refToken", authCookieOptions)
    res.json({ message: "Password updated successfully." })
  } catch (err) {
    console.error("Error changing password:", err.message)
    res.status(500).json({ message: "Failed to change password." })
  }
})
// Get user info
app.get("/user", async (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.json(null)

  try {
    const { uid, version = 0 } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await UserSchema.findById(uid)
    if (!user || (user.tokenVersion || 0) !== version) return res.json(null)
    res.json({
      email: user.email,
      fullname: user.fullname,
      role: user.role,
    })
  } catch {
    res.clearCookie("accessToken", authCookieOptions)
    res.clearCookie("refToken", authCookieOptions)
    res.json(null)
  }
})

// User Registration
app.post("/register", async (req, res) => {
  const { email, password, fullname } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (typeof email !== "string" || typeof password !== "string" || typeof fullname !== "string" || !email.trim() || !fullname.trim()) {
    console.log("Missing required fields")
    return res.status(400).json({ message: "Missing required fields." })
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 254 || fullname.trim().length > 100) {
    console.log("Invalid email address")
    return res.status(400).json({ message: "Invalid email address." })
  }

  if (!validPassword(password)) {
    console.log("Password too short")
    return res.status(400).json({ message: "Password needs 8-128 characters, a number and a special character." })
  }

  try {
    const existingUser = await UserSchema.findOne({ email: normalizedEmail })
    if (existingUser) {
      console.log("Email already in use")
      return res.status(400).json({ message: "Email already in use." })
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserSchema({ email: normalizedEmail, password: hashedPassword, fullname: fullname.trim() })
    await newUser.save()
    console.log("User registered successfully")
    res.status(201).json({ message: "User registered successfully." })
  } catch (err) {
    console.error("Error during registration:", err.message)
    res.status(err.code === 11000 ? 409 : 500).json({ message: err.code === 11000 ? "Email already in use." : "Failed to register user." })
  }
})

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    console.log("Missing email or password")
    return res.status(400).json({ message: "Missing email or password." })
  }

  try {
    const fetchedUser = await UserSchema.findOne({ email: String(email).trim().toLowerCase() }).collation({ locale: "en", strength: 2 })

    if (!fetchedUser || !(await bcrypt.compare(password, fetchedUser.password))) {
      console.log("Invalid credentials")
      return res.status(400).json({ message: "Invalid credentials." })
    }

    const accessToken = jwt.sign({ uid: fetchedUser._id.toString(), version: fetchedUser.tokenVersion || 0 }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10d",
    })

    // Store the token in an HTTP-only cookie.
    res.cookie("accessToken", accessToken, { ...authCookieOptions, expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) })
    console.log("Login successful")
    res.status(200).json({
      message: "Login successful.",
      user: { id: fetchedUser._id, email: fetchedUser.email, role: fetchedUser.role },
    })
  } catch (err) {
    console.error("Error during login:", err.message)
    res.status(500).json({ message: "Failed to log in." })
  }
})

//log out
app.post("/logout", (req, res) => {
  res.clearCookie("refToken", authCookieOptions)
  res.clearCookie("accessToken", authCookieOptions)
  res.status(200).json({ message: "Logged out successfully." })
})

// Get Categories
app.get("/get-categories", (req, res) => {
  res.status(200).json(categories)
})

// Get Menu Items
app.get("/get-menu", async (req, res) => {
  const { category } = req.query
  try {
    const filter = category ? { category } : {}
    const menuItems = await MenuItem.find(filter)
    res.status(200).json(menuItems)
  } catch (err) {
    console.error("Error fetching menu items:", err.message)
    res.status(500).json({ message: "Failed to fetch menu items." })
  }
})

// Add Menu Item
app.post("/add-menu-item", adminCheck, parseMenuImage, async (req, res) => {
  const { name, description, price, category, image = "" } = req.body
  if (!validMenuItem({ name, description, price, category, image })) return res.status(400).json({ message: 'Invalid menu item.' });

  let uploadedImage;
  try {
    if (req.file) uploadedImage = await saveMenuImage(req.file);
  } catch {
    return res.status(400).json({ message: 'The file is not a valid JPEG, PNG or WebP image.' });
  }
  try {
    const newItem = new MenuItem({ name: name.trim(), description: description.trim(), price: Number(price), category, image: uploadedImage || image })
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  } catch (err) {
    await removeMenuImage(uploadedImage);
    console.error("Error adding menu item:", err.message)
    res.status(500).json({ message: "Failed to add menu item." })
  }
})

// Update Menu Item
app.put("/update-menu-item/:id", adminCheck, parseMenuImage, async (req, res) => {
  const { id } = req.params
  const { name, description, price, category, image = "" } = req.body
  if (!validMenuItem({ name, description, price, category, image })) return res.status(400).json({ message: 'Invalid menu item.' });

  let uploadedImage;
  try {
    if (req.file) uploadedImage = await saveMenuImage(req.file);
  } catch {
    return res.status(400).json({ message: 'The file is not a valid JPEG, PNG or WebP image.' });
  }
  try {
    const previous = await MenuItem.findById(id);
    if (!previous) {
      await removeMenuImage(uploadedImage);
      return res.status(404).json({ message: 'Menu item not found.' });
    }
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name: name.trim(), description: description.trim(), price: Number(price), category, image: uploadedImage || image },
      { new: true, runValidators: true },
    )

    if (!updatedItem) {
      await removeMenuImage(uploadedImage);
      return res.status(404).json({ message: "Menu item not found." })
    }

    if (previous.image !== updatedItem.image) await removeUnusedMenuImage(previous.image).catch(() => {});
    res.json(updatedItem)
  } catch (err) {
    await removeMenuImage(uploadedImage);
    console.error("Error updating menu item:", err.message)
    res.status(500).json({ message: "Failed to update menu item." })
  }
})

// Delete Menu Item
app.delete("/delete-menu-item/:id", adminCheck, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id)
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." })
    }
    await removeUnusedMenuImage(deletedItem.image).catch(() => {});
    res.status(200).json({ message: "Item deleted.", item: deletedItem })
  } catch (err) {
    console.error("Error deleting menu item:", err.message)
    res.status(500).json({ message: "Failed to delete menu item." })
  }
})

// Create a reservation request
app.post("/reservation-request", gatherUserInfo, async (req, res) => {
  try {
    const { date, startHour, people } = req.body;
    const requestedDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T00:00:00`) : new Date(NaN);
    if (Number.isNaN(requestedDate.getTime()) || requestedDate.getFullYear() !== Number(date.slice(0, 4)) ||
      requestedDate.getMonth() + 1 !== Number(date.slice(5, 7)) || requestedDate.getDate() !== Number(date.slice(8, 10))) {
      return res.status(400).json({ message: "Invalid date" });
    }
    if (requestedDate < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ message: "Date must not be in the past" });

    if (!Number.isInteger(people) || people < 1 || people > 20) {
      return res.status(400).json({ message: "People count must be between 1 and 20" });
    }

    const reservationTime = new Date(requestedDate)
    reservationTime.setHours(startHour, 0, 0, 0)
    if (!Number.isInteger(startHour) || startHour < 10 || startHour > 21 || reservationTime.getTime() < Date.now() + 4 * 60 * 60 * 1000) {
      return res.status(400).json({ message: "Reservation must be at least four hours ahead, between 10:00 and 21:00" });
    }
    if (await Reservation.exists({ userId: req.user._id, date: requestedDate, startHour, status: { $ne: "cancelled" } })) return res.status(409).json({ message: "You already have a reservation at this time" });

    const newReservation = new Reservation({
      userId: req.user._id,
      date: requestedDate,
      startHour,
      people,
      status: "pending",
    });
    await newReservation.save();

    res.status(201).json({ message: "Reservation request sent successfully" });
  } catch (error) {
    console.error("Error creating reservation request:", error);
    res.status(500).json({ message: "Failed to create reservation request" });
  }
});

// Get user's reservations
app.get("/user/reservations", gatherUserInfo, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id });
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ message: "Failed to fetch user reservations" });
  }
});

// Cancel a reservation
app.put("/user/reservations/:id/cancel", gatherUserInfo, async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ _id: id, userId: req.user._id });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Reservation is already cancelled" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    await Message.deleteMany({ receiver: req.user._id, reservationId: reservation._id });

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ message: "Failed to cancel reservation" });
  }
});




// Route to mark a task as completed
app.put("/tasks/:id/complete", gatherUserInfo, async (req, res) => {
  try {
    const { id } = req.params
    
    // Find the message by ID
    const message = await Message.findById(id)
    
    if (!message) {
      return res.status(404).json({ message: "Task not found" })
    }
    
    // Check if the logged-in user is the receiver of the task
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this task" })
    }
    
    // Check if the message is a task
    if (message.type !== "task") {
      return res.status(400).json({ message: "This message is not a task" })
    }
    const result = await Message.updateOne({ _id: id, status: { $ne: "completed" } }, { status: "completed" })
    if (!result.modifiedCount) return res.status(200).json({ message: "Task already completed" })
    
    // Create a notification for the admin who assigned the task
    const adminNotification = new Message({
      sender: req.user._id,
      receiver: message.sender, 
      title: "Задача изпълнена",
      content: `Задачата "${message.title.replace('Нова задача: ', '')}" беше маркирана като изпълнена от ${req.user.fullname}.`,
      type: "notification"
    })
    
    await adminNotification.save()
    
    res.status(200).json({ message: "Task marked as completed" })
  } catch (error) {
    console.error("Error completing task:", error)
    res.status(500).json({ message: "Failed to complete task" })
  }
})



// Start Server
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost';

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB")
  app.listen(PORT, isProduction ? "0.0.0.0" : "127.0.0.1", () => {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? process.env.API_BASE_URL || 'https://chefconnect-1.onrender.com'
    : `${API_BASE_URL}:${PORT}`;
  
  console.log(`Server running on ${baseUrl}`);
  });
}).catch((err) => { console.error("MongoDB connection error:", err); process.exitCode = 1; });

