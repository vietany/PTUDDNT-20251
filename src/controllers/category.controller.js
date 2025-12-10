// File: src/controllers/category.controller.js
const Category = require('../models/category.model');

// 1. Hàm lấy danh sách (Get All)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Hàm tạo mới (Create)
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Hàm sửa (Update) 
exports.updateCategory = async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Hàm xóa (Delete)
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};