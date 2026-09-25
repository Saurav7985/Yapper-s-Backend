const mongoose = require('mongoose');

const joinRequestSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  reason: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
