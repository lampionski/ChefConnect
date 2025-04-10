const UserSchema = require("../Schemas/UserSchema")
const jwt = require("jsonwebtoken")
// require("dotenv").config()

async function adminCheck(req, res, next) {
  try {
    const token = req.cookies["accessToken"]
    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const fetchedUser = await UserSchema.findById(decodedToken.uid)

    if (!fetchedUser || fetchedUser.role !== "admin") {
      return res.status(403).json({ message: "Insufficient permissions!" })
    }

    req.user = fetchedUser
    next()
  } catch (error) {
    console.error("Error in admin check middleware:", error)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }
    res.status(500).json({ message: "Server error during authentication" })
  }
}

module.exports = adminCheck


