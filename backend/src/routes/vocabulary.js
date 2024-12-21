// backend/src/routes/vocabulary.js

import express from 'express';
import { translateWord } from '../services/translation.js';
import Vocabulary from '../models/Vocabulary.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import XLSX from 'xlsx';
import fs from 'fs';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Add new vocabulary word
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received vocabulary data:', req.body);
    console.log('User from auth:', req.user);
    
    const { word, bookId, context, etymology } = req.body;
    
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Translate the word to supported languages
    const [spanishTranslation, frenchTranslation] = await Promise.all([
      translateWord(word, 'es'),
      translateWord(word, 'fr')
    ]);

    const vocabulary = new Vocabulary({
      word,
      bookId,
      context,
      etymology,
      translations: {
        es: spanishTranslation,
        fr: frenchTranslation
      },
      createdBy: req.user.userId // Using userId from auth token
    });

    const savedVocabulary = await vocabulary.save();
    console.log('Saved vocabulary:', savedVocabulary);
    res.status(201).json(savedVocabulary);
  } catch (error) {
    console.error('Error adding vocabulary:', error);
    res.status(500).json({ 
      message: 'Error adding vocabulary word',
      error: error.message 
    });
  }
});

// Upload vocabulary file
router.post('/upload/:bookId', auth, upload.single('vocabulary'), async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read and parse the Excel file
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const vocabularyList = XLSX.utils.sheet_to_json(sheet);

    // Save vocabulary data
    const savedVocabulary = await Promise.all(
      vocabularyList.map(async (item) => {
        const translations = {
          es: await translateWord(item.word, 'es'),
          fr: await translateWord(item.word, 'fr')
        };

        return new Vocabulary({
          word: item.word,
          bookId,
          context: item.context,
          etymology: item.etymology,
          translations,
          createdBy: req.user.userId
        }).save();
      })
    );

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    res.status(201).json(savedVocabulary);
  } catch (error) {
    console.error('Error uploading vocabulary:', error);
    res.status(500).json({ 
      message: 'Error uploading vocabulary',
      error: error.message 
    });
  }
});

// Get vocabulary words for a book
router.get('/book/:bookId', auth, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({ 
      bookId: req.params.bookId 
    })
    .sort({ createdAt: -1 })
    .populate('createdBy', 'username'); // Add this if you want user details

    res.json(vocabulary);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    res.status(500).json({ message: 'Error fetching vocabulary words' });
  }
});

// Update vocabulary word
router.put('/:id', auth, async (req, res) => {
  try {
    const { etymology, context } = req.body;
    const vocabulary = await Vocabulary.findOneAndUpdate(
      { 
        _id: req.params.id,
        createdBy: req.user.userId // Ensure users can only update their own entries
      },
      { $set: { etymology, context } },
      { new: true }
    );

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary word not found or unauthorized' });
    }

    res.json(vocabulary);
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    res.status(500).json({ message: 'Error updating vocabulary word' });
  }
});

// Delete vocabulary word
router.delete('/:id', auth, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.findOneAndDelete({ 
      _id: req.params.id,
      createdBy: req.user.userId // Ensure users can only delete their own entries
    });

    if (!vocabulary) {
      return res.status(404).json({ message: 'Vocabulary word not found or unauthorized' });
    }

    res.json({ message: 'Vocabulary word deleted' });
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    res.status(500).json({ message: 'Error deleting vocabulary word' });
  }
});

// Get all vocabulary words (admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({})
      .populate('bookId', 'title') // This will include the book title
      .sort({ createdAt: -1 });
    res.json(vocabulary);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
    res.status(500).json({ message: 'Error fetching vocabulary words' });
  }
});

// Bulk upload vocabulary words
router.post('/upload', [auth, adminAuth, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const words = XLSX.utils.sheet_to_json(sheet);

    const savedWords = await Promise.all(
      words.map(async (word) => {
        return new Vocabulary({
          word: word.Word,
          definition: word.Definition,
          bookId: word.BookId, // Make sure this is included in your Excel file
          createdBy: req.user.userId
        }).save();
      })
    );

    res.status(201).json(savedWords);
  } catch (error) {
    console.error('Error uploading vocabulary:', error);
    res.status(500).json({ message: 'Error processing vocabulary upload' });
  }
});



export default router;