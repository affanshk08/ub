const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // e.g., "Appetizer", "Wedding Combo"
  description: { type: String },
  price: { type: Number, required: true },
  isCombo: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', MenuSchema);