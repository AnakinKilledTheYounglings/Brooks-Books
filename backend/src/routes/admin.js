// backend/src/routes/admin.js
import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

const router = express.Router();

// Delete a drawing
router.delete('/books/:bookId/drawings/:drawingId', auth, adminAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Find and remove the drawing
    const drawingIndex = book.drawings.findIndex(
      drawing => drawing._id.toString() === req.params.drawingId
    );

    if (drawingIndex === -1) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    // Remove the drawing
    book.drawings.splice(drawingIndex, 1);
    await book.save();

    res.json({ message: 'Drawing deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;