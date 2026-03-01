const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get all menu items
router.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new menu item
router.post('/menu', async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    res.status(201).json({ message: "Menu item added!", menu: newMenu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a menu item
router.delete('/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;