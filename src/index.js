require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const errorHandler = require('./middleware/errorHandler');

const app = express();
connectDB();

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Global rate limiter (light)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120
});
app.use(globalLimiter);
app.get('/', (req, res) => {
  res.send("Hello World");
})
// routes
app.use('/api/auth', authRoutes);
app.use('/api', profileRoutes);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
