const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String // URL đến ảnh icon của category
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);