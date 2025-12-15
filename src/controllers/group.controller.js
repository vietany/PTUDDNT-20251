const Group = require('../models/group.model');
const User = require('../models/user.model');


exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const newGroup = await Group.create({
      name,
      admin: req.user._id,
      members: [req.user._id]
    });
    
    
    await User.findByIdAndUpdate(req.user._id, { group: newGroup._id });

    res.status(201).json({ success: true, data: newGroup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMyGroup = async (req, res) => {
  try {
    
    const user = await User.findById(req.user._id);
    if (!user.group) {
        return res.status(404).json({ success: false, message: "Bạn chưa tham gia nhóm nào." });
    }

    const group = await Group.findById(user.group).populate('members', 'name email');
    res.status(200).json({ success: true, data: group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
