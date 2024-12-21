// backend/src/models/ChatMessage.js
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  mediaUrl: {
    type: String
  },
  mediaType: {
    type: String,
    enum: ['gif', 'image', null]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Messages automatically delete after 24 hours
  }
});

// Keep only the last 200 messages
chatMessageSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 86400,
  capped: { 
    size: 1024 * 1024, // 1MB size
    max: 200 // Maximum 200 documents
  } 
});

export default mongoose.model('ChatMessage', chatMessageSchema);