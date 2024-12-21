// backend/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
  },
  // Only define profilePhoto once
  profilePhoto: {
    type: String,
    default: null
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String,
    enum: ['READER', 'ARTIST', 'HELPER', 'STAR']
  }],
  completedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  achievements: [{
    type: String,
    enum: ['BEGINNER_ARTIST', 'REGULAR_ARTIST', 'MASTER_ARTIST', 'POPULAR_DRAWING', 'BOOKWORM']
  }],
  totalLikes: {
    type: Number,
    default: 0
  },
  pointsHistory: [{
    action: String,
    points: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      type: Object,
      default: {}
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);