// backend/src/routes/quiz.js

import express from 'express';
import auth from '../middleware/auth.js';
import { generateQuestions } from '../services/quizGenerator.js';
import Vocabulary from '../models/Vocabulary.js';

const router = express.Router();

// Generate quiz for a specific book
router.get('/book/:bookId', auth, async (req, res) => {
  try {
    console.log('Quiz route hit for book:', req.params.bookId);
    
    // Get vocabulary words for the book
    const vocabularyWords = await Vocabulary.find({ 
      bookId: req.params.bookId 
    });

    console.log('Found vocabulary words:', vocabularyWords.length);

    if (!vocabularyWords.length) {
      return res.status(404).json({ 
        message: 'No vocabulary words found for this book' 
      });
    }

    // Generate quiz questions
    const questions = await generateQuestions(vocabularyWords);
    console.log('Generated questions:', questions.length);

    res.json({
      total: questions.length,
      questions: questions
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ message: 'Error generating quiz' });
  }
});

export default router;
