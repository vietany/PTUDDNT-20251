const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// 1. Kiểm tra User đã đăng nhập chưa
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
      
      if (!req.user) {
         return res.status(401).json({ 
            code: '00013', 
            message: 'User không tồn tại.' 
         });
      }

      next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        code: '00012',
        message: 'Token không hợp lệ hoặc đã hết hạn.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      code: '00006',
      message: 'Truy cập bị từ chối. Không có token được cung cấp.'
    });
  }
};

// 2. Kiểm tra có phải Admin không
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      code: '00014',
      message: 'Truy cập bị từ chối. Bạn không phải là Quản trị viên.'
    });
  }
};

module.exports = { protect, isAdmin };