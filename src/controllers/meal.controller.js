const Meal = require('../models/meal.model');
const User = require('../models/user.model');

// Tạo kế hoạch ăn
exports.createMeal = async (req, res) => {
  try {
    const { name, date, items } = req.body; // items: [{ type: 'food'|'recipe', id: '...' }]
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    if (!items || items.length === 0) return res.status(400).json({ message: 'Chưa chọn món nào' });

    const mealsToCreate = items.map(item => ({
      name,
      date,
      group: user.group,
      food: item.type === 'food' ? item.id : null,
      recipe: item.type === 'recipe' ? item.id : null
    }));

    const createdMeals = await Meal.insertMany(mealsToCreate);
    res.status(201).json({ code: '00322', data: createdMeals });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Lấy lịch ăn
exports.getMeals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    // Lấy hết hoặc lọc theo ngày (nếu cần)
    const meals = await Meal.find({ group: user.group })
      .populate('food')
      .populate('recipe')
      .sort({ date: 1 });
    res.status(200).json({ code: '00348', data: meals });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.status(200).json({ code: '00330', message: 'Đã xóa' });
  } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.updateMeal = async (req, res) => {
  try {
    const { name, date, foodId, recipeId } = req.body;
    const updateData = { name, date };
    if (foodId) updateData.food = foodId;
    if (recipeId) updateData.recipe = recipeId;

    // Nếu chuyển đổi giữa food và recipe, cần set cái kia null
    if (foodId && !recipeId) updateData.recipe = null;
    if (recipeId && !foodId) updateData.food = null;

    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ code: '00331', data: updatedMeal });
  } catch (e) { res.status(500).json({ message: e.message }); }
};
