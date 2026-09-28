const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../utils/mockStore');
const { getIsConnected } = require('../config/db');
const emailService = require('../services/emailService');

const generateToken = (id, role, name, email) => {
  return jwt.sign(
    { id, role, name, email },
    process.env.JWT_SECRET || 'foodie_super_secret_jwt_key_2026_production_ready',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (getIsConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        phone: phone || '',
        role: role && ['USER', 'RESTAURANT_OWNER', 'ADMIN'].includes(role) ? role : 'USER'
      });

      // Dispatch Brevo welcome email
      emailService.sendWelcomeEmail(user);

      const token = generateToken(user._id, user.role, user.name, user.email);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } else {
      // Mock Fallback Mode
      const existing = mockStore.users.find(u => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const newUser = {
        _id: 'usr_' + Date.now(),
        name,
        email,
        phone: phone || '',
        role: role && ['USER', 'RESTAURANT_OWNER', 'ADMIN'].includes(role) ? role : 'USER'
      };
      mockStore.users.push(newUser);

      emailService.sendWelcomeEmail(newUser);

      const token = generateToken(newUser._id, newUser.role, newUser.name, newUser.email);
      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: newUser
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getIsConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.role, user.name, user.email);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, avatar: user.avatar }
      });
    } else {
      // Mock mode: Allow login for demo accounts or any valid credentials
      let user = mockStore.users.find(u => u.email === email);
      if (!user) {
        // Automatically create user in mock mode if logging in for demo ease
        user = {
          _id: 'usr_' + Date.now(),
          name: email.split('@')[0],
          email,
          role: email.includes('admin') ? 'ADMIN' : 'USER',
          phone: '9876543210'
        };
        mockStore.users.push(user);
      }

      const token = generateToken(user._id, user.role, user.name, user.email);
      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get current logged in user profile
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot Password Request
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Please provide an email' });

    await emailService.sendPasswordResetEmail({ email }, 'demo-reset-token-12345');
    return res.json({
      success: true,
      message: 'Password reset link sent to your email address'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, forgotPassword };
