const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. PLACE AN ORDER
router.post('/place', async (req, res) => {
  try {
    const { 
      userId, userName, items, 
      totalPrice, orderDate, orderTime, phoneNumber, utrNumber 
    } = req.body;
    
    const newOrder = new Order({
      user: userId,
      userName,
      items, // Expecting an array of item objects
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

// 2. GET ALL ORDERS
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. UPDATE STATUS
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

// 4. GET ALL ORDERS FOR A SPECIFIC USER
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SUBMIT FEEDBACK
router.post('/:id/feedback', async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { hasFeedback: true, feedback: { rating, comment } },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;