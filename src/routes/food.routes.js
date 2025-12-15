const express = require('express');
const router = express.Router();
const controller = require('../controllers/food.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.createFood);
router.get('/', protect, controller.getAllFoods);

module.exports = router;
