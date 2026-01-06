const Group = require('../models/group.model');
const User = require('../models/user.model');

// Tạo nhóm
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    if (user.group) return res.status(400).json({ message: 'Bạn đã có nhóm rồi' });

    const newGroup = await Group.create({
      name,
      admin: user._id,
      members: [user._id]
    });

    user.group = newGroup._id;
    await user.save();

    res.status(201).json({ code: '00095', data: newGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin nhóm
exports.getMyGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(404).json({ code: '00096', message: 'Chưa vào nhóm' });

    const group = await Group.findById(user.group).populate('members', 'name email role phone dob');
    res.status(200).json({ code: '00098', data: group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mời thành viên (Add Member)
exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const adminUser = await User.findById(req.user._id);
    const group = await Group.findById(adminUser.group);

    // Check quyền Admin nhóm
    if (group.admin.toString() !== adminUser._id.toString()) {
      return res.status(403).json({ message: 'Bạn không phải trưởng nhóm' });
    }

    const member = await User.findOne({ email });
    if (!member) return res.status(404).json({ code: '00099X', message: 'Không tìm thấy email này' });
    if (member.group) return res.status(400).json({ code: '00099', message: 'Người này đã có nhóm rồi' });

    // Thêm vào nhóm
    group.members.push(member._id);
    await group.save();

    member.group = group._id;
    await member.save();

    res.status(200).json({ code: '00102', message: 'Đã mời thành công', data: group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rời nhóm
exports.leaveGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.group) return res.status(400).json({ message: 'Bạn chưa có nhóm' });

    const group = await Group.findById(user.group);

    // Xóa user khỏi list members
    group.members = group.members.filter(m => m.toString() !== user._id.toString());

    // Nếu nhóm trống thì xóa luôn nhóm
    if (group.members.length === 0) {
      await Group.findByIdAndDelete(group._id);
    } else {
      // Nếu admin rời, chuyển quyền cho người kế tiếp
      if (group.admin.toString() === user._id.toString()) {
        group.admin = group.members[0];
      }
      await group.save();
    }

    user.group = null;
    await user.save();

    res.status(200).json({ message: 'Đã rời nhóm thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa thành viên (Kick)
exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    const adminUser = await User.findById(req.user._id);
    const group = await Group.findById(adminUser.group);

    if (group.admin.toString() !== adminUser._id.toString()) {
      return res.status(403).json({ message: 'Chỉ trưởng nhóm mới được xóa' });
    }

    // Xóa khỏi Group
    group.members = group.members.filter(m => m.toString() !== memberId);
    await group.save();

    // Update User kia
    const member = await User.findById(memberId);
    if (member) {
      member.group = null;
      await member.save();
    }

    res.status(200).json({ code: '00106', message: 'Đã mời ra khỏi nhóm' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
