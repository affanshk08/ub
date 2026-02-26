const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/place', async (req, res) => {
  try {
    const { userId, userName, dishName, category, personCount, totalPrice } = req.body;
    const newOrder = new Order({
      user: userId,
      userName,
      dishName,
      category,
      personCount,
      totalPrice
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed!", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 1. PLACE AN ORDER (Used by User on Menu Page)
router.post('/place', async (req, res) => {
  try {
    const { userId, userName, dishName, price, category } = req.body;
    const newOrder = new Order({
      user: userId,
      userName,
      dishName,
      price,
      category
    });
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
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

module.exports = router;