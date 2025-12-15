const express = require('express');
const router = express.Router();
const controller = require('../controllers/fridge.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.addToFridge);
router.get('/', protect, controller.getFridgeItems);
router.put('/:id', protect, controller.updateItem);
router.delete('/:id', protect, controller.deleteItem);

module.exports = router;
