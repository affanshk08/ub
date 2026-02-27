const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  dishName: { type: String, required: true },
  category: { type: String, required: true },
  personCount: { type: Number, required: true, min: 10, max: 5000 },
  totalPrice: { type: Number, required: true },
  orderDate: { type: String, required: true }, 
  orderTime: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  
  // --- REQUIRED FOR UPI PAYMENT ---
  utrNumber: { type: String, required: true },
  
  cookingStatus: {
    type: String,
    enum: ['Pending', 'Cooking', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  
  // --- REQUIRED FOR PROFILE FEEDBACK ---
  hasFeedback: { 
    type: Boolean, 
    default: false 
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);