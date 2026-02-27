const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to verify the JWT token securely
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Token is not valid!" });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: "You are not authenticated!" });
  }
};

// UPDATE PROFILE
router.put("/profile", verifyToken, async (req, res) => {
  try {
    // req.user.id comes from the verified token, ensuring a user can only edit their own profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          profilePic: req.body.profilePic,
        },
      },
      { new: true }
    ).select("-password"); // Prevents sending the password hash back to the frontend

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;