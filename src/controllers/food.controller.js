const Food = require('../models/food.model');
const User = require('../models/user.model');

// Tạo thực phẩm mới (Code 00160)
exports.createFood = async (req, res) => {
  try {
    const { name, category, unit, image } = req.body;
    // Lấy group của user hiện tại
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ code: '00156', message: 'Hãy vào nhóm trước' });

    const newFood = await Food.create({
      name, category, unit, image,
      group: user.group
    });

    res.status(201).json({ code: '00160', message: 'Tạo thực phẩm thành công', data: newFood });
  } catch (error) {
    res.status(500).json({ code: '00159', message: error.message });
  }
};

// Lấy tất cả thực phẩm trong nhóm (Code 00188)
exports.getAllFoods = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ code: '00185', message: 'Bạn chưa vào nhóm' });

    const foods = await Food.find({ group: user.group });
    res.status(200).json({ code: '00188', data: foods });
  } catch (error) {
    res.status(500).json({ code: '00168', message: error.message });
  }
};
