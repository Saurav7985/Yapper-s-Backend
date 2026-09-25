const mongoose = require('mongoose');

const registrationSchema = mongoose.Schema({
  meetup: { type: mongoose.Schema.Types.ObjectId, ref: 'Meetup', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['registered', 'cancelled', 'attended'], default: 'registered' },
}, { timestamps: true });

registrationSchema.index({ user: 1, meetup: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
