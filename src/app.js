const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const rateLimitMiddleware = require('./middleware/rateLimit');


const app = express();
app.use(cors());
app.use(express.json());


// Apply rate limit to login endpoint inside auth route via middleware
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);


// Global error handler
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ message: err.message || 'Server error' });
});


module.exports = app;