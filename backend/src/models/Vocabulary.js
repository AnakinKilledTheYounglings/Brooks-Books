// backend/src/models/Vocabulary.js

import mongoose from 'mongoose';

const vocabularySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  context: {
    passage: String,
    pageNumber: Number
  },
  etymology: {
    root: String,
    originLanguage: String,
    meaning: String,
    evolution: [{
      period: String,
      form: String
    }]
  },
  translations: {
    es: String,  // Spanish
    fr: String,  // French
    pt: String,  // Portuguese
    it: String,  // Italian
    hi: String,  // Hindi
    zh: String,  // Mandarin Chinese
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
vocabularySchema.index({ word: 1, bookId: 1 }, { unique: true });

const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

export default Vocabulary;