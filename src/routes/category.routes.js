const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

const { protect, isAdmin } = require('../middleware/auth.middleware');



router.get('/', protect, categoryController.getAllCategories);


router.post('/', protect, isAdmin, categoryController.createCategory);


router.put('/:id', protect, isAdmin, categoryController.updateCategory);


router.delete('/:id', protect, isAdmin, categoryController.deleteCategory);

module.exports = router;