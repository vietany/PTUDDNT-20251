const Meal = require('../models/meal.model');
const User = require('../models/user.model');

// Tạo kế hoạch ăn
exports.createMeal = async (req, res) => {
  try {
    const { name, date, foodId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    const newMeal = await Meal.create({
      name, date, food: foodId, group: user.group
    });
    res.status(201).json({ code: '00322', data: newMeal });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Lấy lịch ăn
exports.getMeals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });
    
    // Lấy hết hoặc lọc theo ngày (nếu cần)
    const meals = await Meal.find({ group: user.group }).populate('food').sort({ date: 1 });
    res.status(200).json({ code: '00348', data: meals });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteMeal = async (req, res) => {
    try {
        await Meal.findByIdAndDelete(req.params.id);
        res.status(200).json({ code: '00330', message: 'Đã xóa' });
    } catch (e) { res.status(500).json({ message: e.message }); }
}
