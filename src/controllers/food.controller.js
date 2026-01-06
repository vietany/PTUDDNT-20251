const Food = require('../models/food.model');
const User = require('../models/user.model');

// Tạo thực phẩm mới (Code 00160)
exports.createFood = async (req, res) => {
  try {
    console.log("[CREATE FOOD] Body:", req.body);
    const { name, category, unit, image } = req.body;
    // Lấy group của user hiện tại
    const user = await User.findById(req.user._id);

    const foodData = { name, category, unit, image };
    if (user.group) {
      foodData.group = user.group;
    } else {
      foodData.user = user._id;
    }

    const newFood = await Food.create(foodData);

    res.status(201).json({ code: '00160', message: 'Tạo thực phẩm thành công', data: newFood });
  } catch (error) {
    console.log("[CREATE FOOD ERROR]", error);
    res.status(500).json({ code: '00159', message: error.message });
  }
};

// Lấy tất cả thực phẩm trong nhóm (Code 00188)
exports.getAllFoods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let foods;

    if (user.group) {
      foods = await Food.find({ group: user.group });
    } else {
      foods = await Food.find({ user: user._id });
    }

    res.status(200).json({ code: '00188', data: foods });
  } catch (error) {
    res.status(500).json({ code: '00168', message: error.message });
  }
};
