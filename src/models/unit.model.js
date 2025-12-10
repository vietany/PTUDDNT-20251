const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ví dụ: kg, g, lít, chai, gói
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Unit', unitSchema);