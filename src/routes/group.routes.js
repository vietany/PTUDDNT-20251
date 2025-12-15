const express = require('express');
const router = express.Router();
const controller = require('../controllers/group.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, controller.createGroup);
router.get('/my-group', protect, controller.getMyGroup);
router.post('/invite', protect, controller.inviteMember);
router.post('/leave', protect, controller.leaveGroup);
router.post('/remove', protect, controller.removeMember);

module.exports = router;
