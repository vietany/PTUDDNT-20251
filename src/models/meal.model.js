const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Sáng, Trưa, Tối
  date: { type: Date, default: Date.now },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: false },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: false },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Meal', mealSchema);
