// backend/src/models/Discussion.js
import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  mediaUrl: {
    // For GIFs/memes in the main post
    type: String
  },
  mediaType: {
    // To distinguish between GIFs and other media types
    type: String,
    enum: ['gif', 'image', null]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    content: String,
    mediaUrl: String,
    mediaType: {
      type: String,
      enum: ['gif', 'image', null]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    reports: [{
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Discussion', discussionSchema);