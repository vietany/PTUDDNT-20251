const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, default: 1 },
  useWithin: { type: Date }, // Hạn sử dụng
  note: { type: String, default: '' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }
}, { timestamps: true });

module.exports = mongoose.model('FridgeItem', fridgeItemSchema);
