const UserSchema = require("../Schemas/UserSchema");
const jwt = require("jsonwebtoken");

async function gatherUserInfo(req, res, next) {
  const accessToken = jwt.decode(req.cookies["accessToken"]);
  console.log(req.cookies)
  // if (false && accessToken.expire < Date.now())
  //   return res.status(400).send("Token expired");
  if (!accessToken?.uid) return res.status(400).send("Invalid token");
  const fetchedUser = await UserSchema.findById(accessToken.uid);
  req.user = fetchedUser;
  next();
}

module.exports = gatherUserInfo;
