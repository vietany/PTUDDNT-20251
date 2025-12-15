const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: String, default: '1' },
  isBought: { type: Boolean, default: false }
});

const shoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true }, // VD: Đi chợ cuối tuần
  date: { type: Date, default: Date.now },
  note: { type: String },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  tasks: [taskSchema]
}, { timestamps: true });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
