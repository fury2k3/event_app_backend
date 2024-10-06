const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();

// routes
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const purchaseRoute = require('./routes/purchase');

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use user routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/purchases',purchaseRoute);

// Test route
app.get('/', (req, res) => {
  res.send({ msg: 'Test for sending API request!' });
});

// Start the server with timeout adjustments
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Adjust keepAliveTimeout and headersTimeout
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
