const express = require('express');
const router = express.Router();
const controller = require('../controllers/meal.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.createMeal);
router.get('/', protect, controller.getMeals);
router.delete('/:id', protect, controller.deleteMeal);

module.exports = router;
