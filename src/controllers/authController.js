const bcrypt = require('bcrypt');
const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// Signup
exports.signup = async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName) return res.status(400).json({ message: 'Missing required fields' });

    // Duplicate email check
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({ email, fullName, passwordHash: hash, role: role || 'user' });
    await user.save();

    return res.status(201).json({ message: 'User created', user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Wrong credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Wrong credentials' });

    const payload = { id: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token to DB
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    return res.json({ accessToken, refreshToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
  } catch (err) {
    next(err);
  }
};

// Token refresh
exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });

    // verify token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // check in DB
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    const found = user.refreshTokens.some(rt => rt.token === refreshToken);
    if (!found) return res.status(401).json({ message: 'Refresh token not recognized (logged out?)' });

    // Issue new access token (and optionally new refresh token)
    const newAccessToken = signAccessToken({ id: user._id.toString(), role: user.role });
    return res.json({ accessToken: newAccessToken, expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' });
  } catch (err) {
    next(err);
  }
};

// Logout (invalidate refresh token)
exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });

    // find user by refresh token and remove it
    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) return res.status(200).json({ message: 'Logged out' }); // idempotent

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
    return res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
