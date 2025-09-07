const mongoose = require('mongoose');


const blacklistedSchema = new mongoose.Schema({
token: { type: String, required: true },
expiresAt: { type: Date, required: true }
});


blacklistedSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('BlacklistedToken', blacklistedSchema);