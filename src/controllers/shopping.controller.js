const ShoppingList = require('../models/shoppingList.model');
const User = require('../models/user.model');

exports.createList = async (req, res) => {
  try {
    const { name, note } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });
    const newList = await ShoppingList.create({ name, note, group: user.group, tasks: [] });
    res.status(201).json({ code: '00249', data: newList });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.getAllLists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });
    const lists = await ShoppingList.find({ group: user.group }).sort({ createdAt: -1 });
    res.status(200).json({ code: '00292', data: lists });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

exports.addTask = async (req, res) => {
  try {
    const { listId, foodName, quantity } = req.body;
    const list = await ShoppingList.findById(listId);
    list.tasks.push({ foodName, quantity, isBought: false });
    await list.save();
    res.status(200).json({ code: '00287', data: list });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Xóa danh sách
exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    await ShoppingList.findByIdAndDelete(id);
    res.status(200).json({ code: '00275', message: 'Đã xóa danh sách' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Check/Uncheck món hàng
exports.toggleTask = async (req, res) => {
  try {
    const { listId, taskId } = req.body;
    const list = await ShoppingList.findById(listId);
    
    // Tìm task và đảo trạng thái
    const task = list.tasks.id(taskId);
    if (task) {
        task.isBought = !task.isBought;
        await list.save();
    }
    res.status(200).json({ message: 'Updated', data: list });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
