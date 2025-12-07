const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    foodCategoryName: {
      type: String,
      required: true,
    },
    unitName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

foodSchema.index({ name: 1, group: 1 }, { unique: true });

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
