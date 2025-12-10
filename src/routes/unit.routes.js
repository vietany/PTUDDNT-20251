const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unit.controller');

const { protect, isAdmin } = require('../middleware/auth.middleware');


router.get('/', protect, unitController.getAllUnits); 

router.post('/', protect, isAdmin, unitController.createUnit);
router.put('/:id', protect, isAdmin, unitController.updateUnit);
router.delete('/:id', protect, isAdmin, unitController.deleteUnit);

module.exports = router;