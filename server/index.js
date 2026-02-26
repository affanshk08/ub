const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order'); // Logic: Added Order Routes

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---
app.use('/api/auth', authRoutes);     // Auth endpoints: signup, login
app.use('/api/orders', orderRoutes);  // Order endpoints: place, all, update

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('UB Catering Backend is Running...');
});

// MongoDB Connection
// Logic: Port 5000 is for Backend, Port 5173 is for Frontend
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB: UB Catering Database');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });