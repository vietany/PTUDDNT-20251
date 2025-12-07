const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({
        code: '00012',
        message: 'Token không hợp lệ hoặc đã hết hạn.'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      code: '00006',
      message: 'Truy cập bị từ chối. Không có token được cung cấp.'
    });
  }
};

module.exports = { protect };
