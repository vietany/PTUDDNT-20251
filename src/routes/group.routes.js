const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, groupController.createGroup);
router.get('/my-group', protect, groupController.getMyGroup);

module.exports = router;
