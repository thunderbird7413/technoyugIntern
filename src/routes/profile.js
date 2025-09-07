const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Protected profile route
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-passwordHash -refreshTokens');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
