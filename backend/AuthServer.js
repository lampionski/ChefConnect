const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserSchema = require("./Schemas/UserSchema");
const gatherUserInfo = require("./Middlewares/gatherUserInfo.js");
const adminCheck = require("./Middlewares/adminCheck.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cookieParser = require("cookie-parser")


const menuRoutes = require('./routes/menuRoutes');

// Other middleware
app.use('/menu', menuRoutes);


mongoose.connect(process.env.DB_CONNECTION_STRING);

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.post("/register", async (req, res) => {
  const user = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !user.email &&
    !user.password &&
    !user.fullname
  )
    return res.sendStatus(400);

  if (!emailRegex.test(user.email))
    return res.status(400).json({ errors: { email: "Невалиден имейл" } });

  if (user.password.length < 8)
    return res.status(400).json({ errors: { password: "Паролата е къса" } });

  if (await UserSchema.findOne({ email: user.email }))
    return res
      .status(400)
      .json({ errors: { email: "Имейла вече е използван" } });

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  await UserSchema.create(user);

  res.sendStatus(200);
});

app.post("/login", async (req, res) => {
  const user = req.body;

  if (!user.email && !user.password) return res.sendStatus(400);

  const fetchedUser = await UserSchema.findOne({ email: user.email });

  if (!fetchedUser)
    return res.status(400).json({ errors: { email: "Несъществуващ имейл" } });

  if (!(await bcrypt.compare(user.password, fetchedUser.password)))
    return res.status(400).json({ errors: { password: "Неправилна парола" } });

  const accessTokenExpDate = new Date();
  accessTokenExpDate.setTime(accessTokenExpDate.getTime + 900000);

  const refreshTokenExpDate = new Date();
  accessTokenExpDate.setDate(accessTokenExpDate.getDate() + 10);

  const accessToken = jwt.sign(
    {
      uid: fetchedUser._id.toString(),
      expire: accessTokenExpDate,
    },
    process.env.ACCESS_TOKEN_SECRET
  );

  const refreshToken = jwt.sign(
    {
      uid: fetchedUser._id.toString(),
      expire: refreshTokenExpDate,
    },
    process.env.REFRESH_TOKEN_SECRET
  );

  res.cookie("refToken", refreshToken, {httpOnly: true, sameSite: "strict"});
  res.cookie("accessToken", accessToken, {httpOnly: true, sameSite: "strict"});

  res.sendStatus(200)
});

app.post("/user", gatherUserInfo, async (req, res) => {
  const user = {
    email: req.user.email,
    fullname: req.user.fullname,
    role: req.user.role,
  };
  res.json(user);
});

app.post("get-user/:userId", async (req, res) => {
  const fetchedUser = await UserSchema.findById(req.params.userId);
  const publicUser = {
    fullname: fetchedUser.fullname,
    letter: fetchedUser.letter,
    class: fetchedUser.class,
    classNumber: fetchedUser.classNumber,
    email: fetchedUser.email,
  };

  console.log(publicUser);
  res.json(publicUser);
});

app.get('/get-menu', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new menu item
app.post('/add-item', async (req, res) => {
  const { name, description, price } = req.body;

  const newItem = new MenuItem({
    name,
    description,
    price,
  });

  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// app.post(
//   "/add-book",
//   adminCheck,
//   upload.array("photoFiles", 10),
//   async (req, res) => {
//     const bookDetails = req.body;
//     bookDetails.images = [];
//     if (!bookDetails.title && !bookDetails.author && !bookDetails.releaseDate)
//       return res.status(400).send("Invalid data!");

//     req.files.forEach((file, index) => {
//       const params = {
//         Bucket: "library-kursova",
//         Key: file.originalname,
//         Body: file.buffer,
//       };

//       const uploadResult = s3.upload(params, (err) => {
//         console.log(err);
//       });
//       bookDetails.images.push(
//         `https://library-kursova.s3.eu-north-1.amazonaws.com/${file.originalname}`
//       );
//     });
//     await BookSchema.create(bookDetails);
//     res.sendStatus(200);
//   }
// );



app.listen(3000);
