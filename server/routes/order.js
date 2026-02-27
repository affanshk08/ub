const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. PLACE AN ORDER (Used by Cart)
router.post('/place', async (req, res) => {
  try {
    const { 
      userId, userName, dishName, category, personCount, 
      totalPrice, orderDate, orderTime, phoneNumber, utrNumber 
    } = req.body;
    
    const newOrder = new Order({
      user: userId,
      userName,
      dishName,
      category,
      personCount,
      totalPrice,
      orderDate,
      orderTime,
      phoneNumber,
      utrNumber
    });
    
    await newOrder.save();
    res.status(201).json({ message: "Order placed!", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET ALL ORDERS (Used by Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE STATUS (Used by Admin)
router.patch('/update/:id', async (req, res) => {
  try {
    const { cookingStatus, paymentStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { cookingStatus, paymentStatus },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET ALL ORDERS FOR A SPECIFIC USER (Used by Profile Page)
// THIS WAS MISSING - IT IS REQUIRED TO SHOW ORDERS ON THE PROFILE!
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SUBMIT FEEDBACK (Used by Profile Page)
router.post('/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        hasFeedback: true,
        feedback: { rating, comment }
      },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;