const mongoose = require('mongoose');

const meetupSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  imageUrl: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String },
  location: { type: String },
  address: { type: String },
  capacity: { type: Number, required: true },
  registeredCount: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

meetupSchema.index({ date: 1 });
meetupSchema.index({ status: 1 });

module.exports = mongoose.model('Meetup', meetupSchema);
