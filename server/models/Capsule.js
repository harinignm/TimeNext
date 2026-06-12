const mongoose = require('mongoose');

const capsuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  senderName: { type: String, required: true },
  recipientName: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String }, // Base64 string
  openingDateTime: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { 
  timestamps: true,
  bufferCommands: false 
});

module.exports = mongoose.model('Capsule', capsuleSchema);
