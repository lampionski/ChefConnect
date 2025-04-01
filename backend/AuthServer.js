

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();  // This will load the .env file
const gatherUserInfo = require("./Middlewares/gatherUserInfo");

const adminRoutes = require('./routes/adminRoutes');

const UserSchema = require("./Schemas/UserSchema");
const MenuItem = require("./Schemas/MenuItem");
const Reservation = require("./Schemas/Reservation");
const Message = require("./Schemas/Message");

const app = express();

// Predefined categories
const categories = ["Салата", "Специалитети", "Предястия и Разядки", "Барбекю", "Паста и Ризото", "Риба и Морски Дарове",
  "Бургери и Тортила","Супи" , "Десерти", "Хлебчета", "Сосове", "Напитки"];

const systemId = "67ca90c3808cf1cb279bbeda";

// Connect to MongoDB using the URI from the .env file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(
  cors({
    origin: "https://chefconnectbg.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

app.use('/admin', adminRoutes);


app.get("/messages", gatherUserInfo, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user._id }).populate('sender', '-password');
    res.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    res.status(500).json({ message: "Error fetching messages" })
  }
})

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
    const { newPassword } = req.body
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await UserSchema.findByIdAndUpdate(req.user._id, { password: hashedPassword })
    res.json({ message: "Password updated successfully." })
  } catch (err) {
    console.error("Error changing password:", err.message)
    res.status(500).json({ message: "Failed to change password." })
  }
})

app.get("/user", gatherUserInfo, async (req, res) => {
  if (req.user == null) {
    res.json(null);
    return;
  };
  const user = {
    email: req.user.email,
    fullname: req.user.fullname,
    letter: req.user.letter,
    class: req.user.class,
    classNumber: req.user.classNumber,
    role: req.user.role,
  }
  res.json(user)
})

// User Registration
app.post("/register", async (req, res) => {
  console.log("Received registration request:", req.body)
  const { email, password, fullname } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || !password || !fullname) {
    console.log("Missing required fields")
    return res.status(400).json({ message: "Missing required fields." })
  }

  if (!emailRegex.test(email)) {
    console.log("Invalid email address")
    return res.status(400).json({ message: "Invalid email address." })
  }

  if (password.length < 8) {
    console.log("Password too short")
    return res.status(400).json({ message: "Password must be at least 8 characters." })
  }

  try {
    const existingUser = await UserSchema.findOne({ email })
    if (existingUser) {
      console.log("Email already in use")
      return res.status(400).json({ message: "Email already in use." })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserSchema({ email, password: hashedPassword, fullname })
    await newUser.save()
    console.log("User registered successfully")
    res.status(201).json({ message: "User registered successfully." })
  } catch (err) {
    console.error("Error during registration:", err.message)
    res.status(500).json({ message: "Failed to register user." })
  }
})

// User Login
app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body)
  const { email, password } = req.body

  if (!email || !password) {
    console.log("Missing email or password")
    return res.status(400).json({ message: "Missing email or password." })
  }

  try {
    const fetchedUser = await UserSchema.findOne({ email })

    if (!fetchedUser || !(await bcrypt.compare(password, fetchedUser.password))) {
      console.log("Invalid credentials")
      return res.status(400).json({ message: "Invalid credentials." })
    }

    const accessToken = jwt.sign({ uid: fetchedUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10d",
    })

    const refreshToken = jwt.sign({ uid: fetchedUser._id.toString() }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "10d",
    })

    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "strict", expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) })
    res.cookie("refToken", refreshToken, { httpOnly: true, sameSite: "strict", expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) })
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
app.get("/logout", async (req, res) => {
  const reftoken = req.cookies["refToken"]
  console.log(reftoken)

  if (reftoken) {
    res.clearCookie("refToken", {
      httpOnly: true,
      sameSite: "strict"
    })
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict"
    })
    res.status(200).json({ message: "Logged out successfully." })
  } else {
    res.status(400).json({ message: "No refresh token found." })
  }
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
app.post("/add-menu-item", async (req, res) => {
  const { name, description, price, category, image } = req.body

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "Missing required fields." })
  }

  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid category." })
  }

  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: "Invalid price." })
  }

  try {
    const newItem = new MenuItem({ name, description, price, category, image })
    const savedItem = await newItem.save()
    res.status(201).json(savedItem)
  } catch (err) {
    console.error("Error adding menu item:", err.message)
    res.status(500).json({ message: "Failed to add menu item." })
  }
})

// Update Menu Item
app.put("/update-menu-item/:id", async (req, res) => {
  const { id } = req.params
  const { name, description, price, category, image } = req.body

  try {
    if (price && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ message: "Invalid price." })
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price, category, image },
      { new: true },
    )

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found." })
    }

    res.json(updatedItem)
  } catch (err) {
    console.error("Error updating menu item:", err.message)
    res.status(500).json({ message: "Failed to update menu item." })
  }
})

// Delete Menu Item
app.delete("/delete-menu-item/:id", async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id)
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found." })
    }
    res.status(200).json({ message: "Item deleted.", item: deletedItem })
  } catch (err) {
    console.error("Error deleting menu item:", err.message)
    res.status(500).json({ message: "Failed to delete menu item." })
  }
})

// Create a reservation request
app.post("/reservation-request", gatherUserInfo, async (req, res) => {
  try {
    let { date, startHour, people } = req.body;

    if (people < 1 || people > 20) {
      return res.status(400).json({ message: "People count must be between 1 and 20" });
    }

    if (startHour < 10 || startHour > 22) {
      return res.status(400).json({ message: "Reservation hour must be between 10:00 and 22:00" });
    }

    const newReservation = new Reservation({
      userId: req.user._id,
      date: new Date(date),
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
    
    // Find the message (task)
    const message = await Message.findById(id)
    
    if (!message) {
      return res.status(404).json({ message: "Task not found" })
    }
    
    // Verify that the current user is the receiver of the task
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this task" })
    }
    
    // Verify that it's a task type message
    if (message.type !== "task") {
      return res.status(400).json({ message: "This message is not a task" })
    }
    
    // Update the task status to completed
    message.status = "completed"
    await message.save()
    
    // Optionally, send a notification to the admin who assigned the task
    const adminNotification = new Message({
      sender: req.user._id,
      receiver: message.sender, // The admin who assigned the task
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
app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on http://localhost:3000")
})

