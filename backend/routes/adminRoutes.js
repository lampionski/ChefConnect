const express = require("express")
const router = express.Router()
const adminCheck = require("../Middlewares/adminCheck")
const UserSchema = require("../Schemas/UserSchema") // Update this path if necessary
const gatherUserInfo = require("../Middlewares/gatherUserInfo")

const Reservation = require("../Schemas/Reservation")
const Message = require('../Schemas/Message')

const systemId = "67c80f8230f979730ec3bcfc";

// Protect all routes in this router with admin check
router.use(adminCheck)

// Get all users
router.get("/users",gatherUserInfo, async (req, res) => {
  try {
    const users = await UserSchema.find({}, "-password").sort('fullname')
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

    // Don't allow changing own role (prevent admin from demoting themselves)
    if (req.user._id.toString() === id && req.user.role !== role) {
      return res.status(403).json({ message: "Cannot change your own role" })
    }

    const updatedUser = await UserSchema.findByIdAndUpdate(
      id,
      {
        fullname,
        email,
        role,
      },
      { new: true, select: "-password" },
    )

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    res.status(500).json({ message: "Error updating user" })
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

    const deletedUser = await UserSchema.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    res.status(500).json({ message: "Error deleting user" })
  }
})

// Get all reservations (admin only)
router.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("userId", "fullname email");
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

    const pad = n => n >= 10 ? n.toString() : `0${n}`;

    if (status === 'cancelled') {
      const deleted = await Reservation.findByIdAndDelete(id)

      if (!deleted) {
        return res.status(404).json({ message: "Reservation not deleted" })
      }

      const d = deleted.date;

      const message = new Message({
        sender: systemId,
        receiver: deleted.userId._id,
        title: 'Your reservation has been cancelled!',
        content: `${deleted.people} People, Hour: ${deleted.startHour}:00, Date: ${d.getDate()}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        type: 'text'
      });
  
      await message.save();

      return res.status(200).json({ ...deleted, status: 'cancelled' });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true })
    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" })
    }

    if (status === 'confirmed') {
      const d = updatedReservation.date;

      const message = new Message({
        sender: systemId,
        receiver: updatedReservation.userId._id,
        title: 'Your reservation has been confirmed!',
        content: `${updatedReservation.people} People, Hour: ${updatedReservation.startHour}:00, Date: ${d.getDate()}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
        type: 'reservation',
        reservationId: updatedReservation._id
      });
  
      await message.save();
    }

    res.status(200).json(updatedReservation)
  } catch (error) {
    console.error("Error updating reservation:", error)
    res.status(500).json({ message: "Failed to update reservation" })
  }
})

module.exports = router

