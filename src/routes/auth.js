const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

// Rate limiter specifically for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // max 8 attempts per IP per window
  message: { message: 'Too many login attempts, try again later' }
});

// Signup
router.post('/signup', authController.signup);

// Login (with rate limiting)
router.post('/login', loginLimiter, authController.login);

// Refresh
router.post('/refresh', authController.refresh);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
