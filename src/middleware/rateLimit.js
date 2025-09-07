const rateLimit = require('express-rate-limit');


// rate limit for login to prevent brute force
const loginLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 10,
message: { message: 'Too many login attempts, please try again later.' }
});


module.exports = { loginLimiter };