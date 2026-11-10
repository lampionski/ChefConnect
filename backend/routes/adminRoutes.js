const express = require("express")
const router = express.Router()
const adminCheck = require("../Middlewares/adminCheck")
const UserSchema = require("../Schemas/UserSchema") 
const gatherUserInfo = require("../Middlewares/gatherUserInfo")
const Reservation = require("../Schemas/Reservation")
const Message = require("../Schemas/Message")
const ContactMessage = require("../Schemas/ContactMessage")
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Protect all routes in this router with admin check
router.use(adminCheck)

router.get("/contact-messages", async (req, res) => {
  try { res.json(await ContactMessage.find().sort({ createdAt: -1 }).limit(200)) }
  catch { res.status(500).json({ message: "Failed to load contact messages" }) }
})

// Get all users
router.get("/users", gatherUserInfo, async (req, res) => {
  try {
    const users = await UserSchema.find({}, "-password").sort("fullname")
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Error fetching users" })
  }
})

// Update user
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { fullname, email, role } = req.body
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : ""
    if (typeof fullname !== "string" || !fullname.trim() || fullname.length > 100 || !emailRegex.test(normalizedEmail) || normalizedEmail.length > 254 || !["user", "worker", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid user data" })
    }
    if (await UserSchema.exists({ email: normalizedEmail, _id: { $ne: id } }).collation({ locale: "en", strength: 2 })) return res.status(409).json({ message: "Email already in use" })

    // Don't allow changing own role (prevent admin from demoting themselves)
    if (req.user._id.toString() === id && req.user.role !== role) {
      return res.status(403).json({ message: "Cannot change your own role" })
    }

    //
    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        fullname: fullname.trim(),
        email: normalizedEmail,
        role,
      },
      { new: true, select: "-password", runValidators: true },
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(error.code === 11000 ? 409 : 500).json({ message: error.code === 11000 ? "Email already in use" : "Error updating user" })
  }
})

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(403).json({ message: "Cannot delete your own account" })
    }

    const existingUser = await UserSchema.findById(id)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" })
    }
    await Reservation.deleteMany({ userId: id })
    await Message.deleteMany({ $or: [{ sender: id }, { receiver: id }] })
    await UserSchema.findByIdAndDelete(id)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Error deleting user" })
  }
})

// Get all reservations (admin only)
router.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("userId", "fullname email")
    res.status(200).json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    res.status(500).json({ message: "Failed to fetch reservations" })
  }
})

// Update reservation status (admin only)
router.put("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!["confirmed", "cancelled"].includes(status)) return res.status(400).json({ message: "Invalid status" })

    const pad = (n) => (n >= 10 ? n.toString() : `0${n}`)

    const allowedCurrentStatus = status === "confirmed" ? "pending" : { $in: ["pending", "confirmed"] }
    const updatedReservation = await Reservation.findOneAndUpdate({ _id: id, status: allowedCurrentStatus }, { status }, { new: true, runValidators: true })
    if (!updatedReservation) {
      const existing = await Reservation.findById(id)
      return existing ? res.status(409).json({ message: "Reservation already processed", reservation: existing }) : res.status(404).json({ message: "Reservation not found" })
    }

    if (status === "confirmed" || status === "cancelled") {
      const d = updatedReservation.date

      const message = new Message({
        sender: req.user._id,
        receiver: updatedReservation.userId._id,
        title: status === "confirmed" ? "Your reservation has been confirmed!" : "Your reservation has been cancelled!",
        content: `${updatedReservation.people} People, Hour: ${updatedReservation.startHour}:00, Date: ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        type: status === "confirmed" ? "reservation" : "text",
        reservationId: updatedReservation._id,
      })

      await message.save()
      if (status === "cancelled") await Message.deleteMany({ receiver: updatedReservation.userId, reservationId: updatedReservation._id, type: "reservation" })
    }

    res.status(200).json(updatedReservation)
  } catch (error) {
    console.error("Error updating reservation:", error)
    res.status(500).json({ message: "Failed to update reservation" })
  }
})

// Get all workers
router.get("/workers", gatherUserInfo, async (req, res) => {
  try {
    const users = await UserSchema.find({ role: 'worker' }, "-password").sort("fullname")
    res.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    res.status(500).json({ message: "Error fetching users" })
  }
})

// Assign task to worker
router.post("/assign-task", gatherUserInfo, async (req, res) => {
  try {
    const { workerId, title, description, deadline } = req.body

    // Validate required fields
    if (!workerId || typeof title !== "string" || !title.trim() || typeof description !== "string" || !description.trim() || !deadline) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const deadlineDate = new Date(deadline)
    if (!Number.isFinite(deadlineDate.getTime()) || deadlineDate <= new Date() || title.length > 120 || description.length > 2000) return res.status(400).json({ message: "Invalid task details" })

    // Check if worker exists
    const worker = await UserSchema.findOne({ _id: workerId, role: "worker" })
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    // Format deadline for display
    const formattedDate = `${deadlineDate.getFullYear()}-${String(deadlineDate.getMonth() + 1).padStart(2, "0")}-${String(deadlineDate.getDate()).padStart(2, "0")}`
    const formattedTime = `${String(deadlineDate.getHours()).padStart(2, "0")}:${String(deadlineDate.getMinutes()).padStart(2, "0")}`

    // Create message for the worker
    const message = new Message({
      sender: req.user._id, // Admin who is assigning the task
      receiver: workerId,
      title: `Нова задача: ${title}`,
      content: `${description}\n\nКраен срок: ${formattedDate} ${formattedTime}`,
      type: "task",
      deadline: deadlineDate,
    })

    await message.save()

    res.status(201).json({ message: "Task assigned successfully" })
  } catch (error) {
    console.error("Error assigning task:", error)
    res.status(500).json({ message: "Failed to assign task" })
  }
})


// Get tasks for a specific worker
router.get("/worker-tasks/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params

    // Validate worker exists
    const worker = await UserSchema.findOne({ _id: workerId, role: "worker" })
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" })
    }

    // Find all task messages sent to this worker
    const tasks = await Message.find({
      receiver: workerId,
      type: "task",
    }).sort({ deadline: 1 }) // Sort by deadline (earliest first)

    res.json(tasks)
  } catch (error) {
    console.error("Error fetching worker tasks:", error)
    res.status(500).json({ message: "Error fetching worker tasks" })
  }
})


module.exports = router

