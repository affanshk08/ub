const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order'); 
const userRoutes = require('./routes/user'); 

// Load environment variables
dotenv.config();

const app = express();

// --- SECURE CORS MIDDLEWARE FOR DEPLOYMENT ---
const corsOptions = {
  origin: [
    process.env.CLIENT_URL,  // Your live Vercel link (Set this in Render Dashboard later)
    'http://localhost:5173', // Allows your local frontend to still connect during development
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); 

// Increased payload size limit to allow profile picture (base64) uploads
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// --- ROUTES ---
app.use('/api/auth', authRoutes);     // Auth endpoints: signup, login
app.use('/api/orders', orderRoutes);  // Order endpoints: place, all, update
app.use('/api/users', userRoutes);    // User endpoints: profile update
app.use('/api/admin', require('./routes/admin'));

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send('UB Catering Backend is Running...');
});

// MongoDB Connection
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