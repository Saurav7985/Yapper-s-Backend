const mongoose = require('mongoose');

const momentSchema = mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

momentSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Moment', momentSchema);
