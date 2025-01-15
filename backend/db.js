const mongoose = require('mongoose');

// MongoDB URI
const dbURI = 'mongodb://localhost:27017/'; // Replace "my_database" with your database name

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));
