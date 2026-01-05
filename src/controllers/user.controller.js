const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name, language, timezone, deviceId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        code: '00005',
        message: 'Vui lòng cung cấp đầy đủ thông tin.'
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        code: '00032',
        message: 'Một tài khoản với địa chỉ email này đã tồn tại.'
      });
    }

    const user = await User.create({
      email,
      password,
      name,
      language: language || 'vi',
      timezone: timezone || 'Asia/Ho_Chi_Minh',
      deviceId: deviceId || 'unknown'
    });

    if (user) {
      res.status(201).json({
        code: '00035',
        message: 'Bạn đã đăng ký thành công.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({
        code: '00008',
        message: 'Dữ liệu người dùng không hợp lệ.'
      });
    }
  } catch (error) {
    res.status(500).json({
      code: '00008',
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        code: '00047',
        message: 'Bạn đã đăng nhập thành công.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
          phone: user.phone,
          dob: user.dob,
        },
      });
    } else {
      res.status(401).json({
        code: '00045',
        message: 'Bạn đã nhập một email hoặc mật khẩu không hợp lệ.'
      });
    }
  } catch (error) {
    res.status(500).json({
      code: '00008',
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    code: '00089',
    message: 'Thông tin người dùng đã được lấy thành công.',
    data: req.user
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.dob !== undefined) user.dob = req.body.dob;

    const updatedUser = await user.save();

    // Return updated info
    res.status(200).json({
      code: '00050',
      message: 'Cập nhật thành công',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        dob: updatedUser.dob,
        role: updatedUser.role,
        token: generateToken(updatedUser._id) // Refresh token if needed
      }
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
