const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'foodie_super_secret_jwt_key_2026_production_ready');

    if (getIsConnected()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }
      req.user = user;
    } else {
      // Fallback mock user payload
      req.user = {
        _id: decoded.id || 'usr_demo',
        name: decoded.name || 'Demo Customer',
        email: decoded.email || 'user@foodie.com',
        role: decoded.role || 'USER'
      };
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'foodie_super_secret_jwt_key_2026_production_ready');
      req.user = {
        _id: decoded.id || 'usr_demo',
        name: decoded.name || 'Demo Customer',
        email: decoded.email || 'user@foodie.com',
        role: decoded.role || 'USER'
      };
    } catch (err) {
      // Ignore optional auth error
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
