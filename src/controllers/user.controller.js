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

module.exports = { registerUser, loginUser, getMe };
