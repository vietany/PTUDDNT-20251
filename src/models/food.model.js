const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Thịt, Rau...
  unit: { type: String, default: 'kg' },
  image: { type: String, default: '' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Optionall
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }    // Owner cá nhân
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
