const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 200 },
  category: { type: String },
  content: { type: String },
  imageUrl: { type: String }, // relative path like /uploads/filename.jpg
  imageAlignment: { type: String, enum: ['left','center','right'], default: 'left' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
