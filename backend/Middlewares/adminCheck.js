const UserSchema = require("../Schemas/UserSchema");
const jwt = require("jsonwebtoken");

async function adminCheck(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.decode(token);
  const fetchedUser = await UserSchema.findById(decodedToken.uid);

  if (!fetchedUser?.role === "admin")
    return res.status(400).send("Insufficient permissions!");
  req.body.token = undefined;
  next();
}

module.exports = adminCheck;
