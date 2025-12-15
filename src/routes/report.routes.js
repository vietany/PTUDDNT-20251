const express = require('express');
const router = express.Router();
const controller = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, controller.getStats);

module.exports = router;
