const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipe.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.createRecipe);
router.get('/', protect, controller.getRecipes);

module.exports = router;
