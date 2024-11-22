// models/File.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  date: { type: Date, default: Date.now },
  report: {type: Boolean, default: false}
});

const fileSchema = new mongoose.Schema({
  uploadedBy: {type: String, required: true},
  originalName: {type: String},
  storedName:{type: String, required: true},
  subject: { type: String, required: true },
  subjectCode: { type: String, required: true },
  type: { type: String, enum: ['Notes', 'Lab', 'PYQ'], required: true },
  year: String,
  filePath: { type: String, required: true },
  description:{type: String},
  uploadDate: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],

  isVerified: { type: Boolean, default: false }, // Whether the file is verified
  verifiedBy: { type: String },                 // Admin username/ID who verified the file
  verificationDate: { type: Date }
});

module.exports = mongoose.model('File', fileSchema);
