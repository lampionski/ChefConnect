const UserSchema = require("../Schemas/UserSchema");
const jwt = require("jsonwebtoken");

async function gatherUserInfo(req, res, next) {
  const token = req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Authentication required" });

  try {
    const { uid, version = 0 } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserSchema.findById(uid);
    if (!user || (user.tokenVersion || 0) !== version) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = gatherUserInfo;
