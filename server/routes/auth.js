const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// --- 1. SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    // FIX: Destructure phone from the request body
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user including the phone number
    user = new User({
      name,
      email,
      phone, // FIX: Save phone to DB
      password: hashedPassword
    });

    await user.save();

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      // FIX: Return the phone number in the user object so frontend can store it
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
});

// --- 2. LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      // FIX: Ensure phone is passed during login too
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
});

module.exports = router;