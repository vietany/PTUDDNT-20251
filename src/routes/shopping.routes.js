const express = require('express');
const router = express.Router();
const controller = require('../controllers/shopping.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.createList);
router.get('/', protect, controller.getAllLists);
router.post('/task', protect, controller.addTask);
router.delete('/:id', protect, controller.deleteList);
router.put('/task/toggle', protect, controller.toggleTask);

module.exports = router;
