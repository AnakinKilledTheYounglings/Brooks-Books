// backend/src/models/Book.js
import mongoose from 'mongoose';

const GENRES = [
  'Adventure',
  'Fantasy',
  'Mystery',
  'Science',
  'Historical',
  'Educational',
  'Fiction',
  'Non-Fiction'
];

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  coverImage: {
    type: String,
    default: null
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genres: [{
    type: String,
    enum: GENRES,
    required: true
  }],
  tags: [{
      type: String,
      trim: true
    }],
  description: String,
  ageRange: {
    min: {
      type: Number,
      default: 8
    },
    max: {
      type: Number,
      default: 15
    }
  },
  drawings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    imageUrl: String,
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      content: {
        type: String,
        required: true,
        maxLength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});
vocabulary: [{
    word: String,
    definition: String,
    options: String,  // comma-separated options
    correct_answer: String
  }]


bookSchema.methods.getMostLikedDrawing = function() {
  if (!this.drawings || this.drawings.length === 0) {
    return null;
  }

  return this.drawings.reduce((mostLiked, current) => {
    const currentLikes = current.likes?.length || 0;
    const mostLikedCount = mostLiked.likes?.length || 0;
    return currentLikes > mostLikedCount ? current : mostLiked;
  }, this.drawings[0]);
};

const Book = mongoose.model('Book', bookSchema);

export { GENRES };
export default Book;