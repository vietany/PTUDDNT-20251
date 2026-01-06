const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
