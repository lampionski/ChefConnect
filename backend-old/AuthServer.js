const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRouter = require('./routes/user.js');
require('./db.js');

dotenv.config(); // To load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

app.use('/api', userRouter);
//comment

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
