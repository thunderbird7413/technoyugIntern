const mongoose = require('mongoose');


const refreshTokenSchema = new mongoose.Schema({
token: { type: String, required: true },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
expiresAt: { type: Date, required: true },
createdAt: { type: Date, default: Date.now }
});


refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('RefreshToken', refreshTokenSchema);