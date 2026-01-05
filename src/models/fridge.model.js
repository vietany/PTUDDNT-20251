const mongoose = require('mongoose');

const fridgeItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true, default: 1 },
  useWithin: { type: Date }, // Hạn sử dụng
  note: { type: String, default: '' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Không required nữa
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }    // Thêm owner cá nhân
}, { timestamps: true });

module.exports = mongoose.model('FridgeItem', fridgeItemSchema);
