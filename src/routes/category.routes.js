const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const { protect, isAdmin } = require('../middleware/auth.middleware');


/**
 * @route   GET /api/categories
 * @desc    Lấy tất cả danh mục (Thịt, Rau củ...)
 * @access  Private (User thường cần xem để chọn khi đi chợ)
 */
router.get('/', protect, categoryController.getAllCategories);

/**
 * @route   POST /api/categories
 * @desc    Tạo danh mục mới
 * @access  Private/Admin (Chỉ Admin mới được tạo danh mục hệ thống)
 */
router.post('/', protect, isAdmin, categoryController.createCategory);

/**
 * @route   PUT /api/categories/:id
 * @desc    Sửa tên/ảnh danh mục
 * @access  Private/Admin
 */
router.put('/:id', protect, isAdmin, categoryController.updateCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Xóa danh mục
 * @access  Private/Admin
 */
router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = router;