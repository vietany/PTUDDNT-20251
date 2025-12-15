const FridgeItem = require('../models/fridge.model');
const User = require('../models/user.model');

// Thêm
exports.addToFridge = async (req, res) => {
  try {
    const { foodId, quantity, useWithin, note } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });

    const newItem = await FridgeItem.create({
      food: foodId, quantity, useWithin, note,
      group: user.group
    });
    res.status(201).json({ code: '00202', data: newItem });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Lấy list
exports.getFridgeItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Chưa vào nhóm' });
    const items = await FridgeItem.find({ group: user.group }).populate('food');
    res.status(200).json({ code: '00228', data: items });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Sửa (Update)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // quantity, note...
    const updated = await FridgeItem.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ code: '00216', data: updated });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// Xóa (Delete)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await FridgeItem.findByIdAndDelete(id);
    res.status(200).json({ code: '00224', message: 'Đã xóa' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
