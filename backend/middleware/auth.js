const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};

module.exports = { auth, adminOnly };
