// backend/src/routes/books.js
import express from 'express';
import multer from 'multer';
import Book from '../models/Book.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import { uploadToS3 } from '../middleware/upload.js';
import xlsx from 'xlsx';

// Single upload declaration for both drawings and vocabulary
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Add this route to your existing routes
router.post('/:id/vocabulary/upload', [auth, adminAuth], upload.single('vocabulary'), async (req, res) => {
  try {
    // Read the Excel file
    const workbook = xlsx.read(req.file.buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const vocabulary = xlsx.utils.sheet_to_json(sheet);

    // Update the book with new vocabulary
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { 
        $push: { 
          vocabulary: { 
            $each: vocabulary 
          } 
        } 
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error uploading vocabulary:', error);
    res.status(400).json({ error: error.message });
  }
});


// Add this with your other routes in books.js
router.post('/:id/tags', auth, async (req, res) => {
  try {
    const { tags } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Add new tags to existing tags, remove duplicates
    const updatedTags = [...new Set([...book.tags || [], ...tags])];
    
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { tags: updatedTags },
      { new: true }
    );

    res.json(updatedBook);
  } catch (error) {
    console.error('Error adding tags:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({})
      .sort({ addedAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update book (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    console.log('Updating book:', req.params.id); // Debug log
    console.log('Update data:', req.body); // Debug log
    
    const { title, author, description, ageRange, genres, tags } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        description,
        ageRange,
        genres,
        tags
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new book
router.post('/', auth, async (req, res) => {
  try {
    const { title, author, description, ageRange } = req.body;
    
    const book = new Book({
      title,
      author,
      description,
      ageRange
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Upload drawing
// backend/src/routes/books.js
// Update the drawing upload route:

router.post('/:bookId/drawings', auth, upload.single('drawing'), async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Book ID:', req.params.bookId);
    console.log('File:', req.file);  // Add this to debug

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Upload to S3
    try {
      const imageUrl = await uploadToS3(req.file);
      console.log('Image uploaded to S3:', imageUrl);

      // Add drawing to book
      const drawing = {
        userId: req.user._id,
        imageUrl: imageUrl,
        likes: []
      };

      book.drawings.push(drawing);
      await book.save();

      // Award points for uploading
      const pointsResult = await awardPoints(req.user._id, 'UPLOAD_DRAWING', {
        bookId: book._id,
        drawingId: drawing._id
      });

      res.status(201).json({
        message: 'Drawing uploaded successfully',
        book,
        pointsAwarded: pointsResult.pointsAwarded,
        newAchievements: pointsResult.newAchievements
      });
    } catch (uploadError) {
      console.error('S3 Upload Error:', uploadError);
      return res.status(400).json({ error: 'Failed to upload image to S3' });
    }
  } catch (error) {
    console.error('Route Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Like a drawing
router.post('/:bookId/drawings/:drawingId/like', auth, async (req, res) => {
  try {
    console.log('Like request received:', {
      userId: req.user._id,
      bookId: req.params.bookId,
      drawingId: req.params.drawingId
    });

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const drawing = book.drawings.id(req.params.drawingId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    // Check if user already liked this drawing
    const alreadyLiked = drawing.likes?.includes(req.user._id);
    console.log('Already liked:', alreadyLiked);

    if (alreadyLiked) {
      return res.status(400).json({ error: 'Already liked this drawing' });
    }

    // Add like
    drawing.likes = drawing.likes || [];
    drawing.likes.push(req.user._id);
    await book.save();

    console.log('Like added successfully', {
      newLikesCount: drawing.likes.length,
      likes: drawing.likes
    });

    res.json({
      message: 'Drawing liked successfully',
      likes: drawing.likes.length
    });
  } catch (error) {
    console.error('Error in like route:', error);
    res.status(400).json({ error: error.message });
  }
});

// Unlike a drawing
router.post('/:bookId/drawings/:drawingId/unlike', auth, async (req, res) => {
  try {
    console.log('Unlike request received:', {
      userId: req.user._id,
      bookId: req.params.bookId,
      drawingId: req.params.drawingId
    });

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const drawing = book.drawings.id(req.params.drawingId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    // Remove like if it exists
    const likeIndex = drawing.likes?.indexOf(req.user._id);
    console.log('Like index:', likeIndex);

    if (likeIndex === -1) {
      return res.status(400).json({ error: 'Drawing not liked yet' });
    }

    drawing.likes.splice(likeIndex, 1);
    await book.save();

    console.log('Like removed successfully', {
      newLikesCount: drawing.likes.length,
      likes: drawing.likes
    });

    res.json({
      message: 'Drawing unliked successfully',
      likes: drawing.likes.length
    });
  } catch (error) {
    console.error('Error in unlike route:', error);
    res.status(400).json({ error: error.message });
  }
});

// Add a comment to a drawing
router.post('/:bookId/drawings/:drawingId/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const drawing = book.drawings.id(req.params.drawingId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    const comment = {
      userId: req.user._id,
      username: req.user.username,
      content: content.trim(),
      createdAt: new Date()
    };

    drawing.comments.push(comment);
    await book.save();

    // Award points for receiving a comment
    const pointsResult = await awardPoints(drawing.userId, 'RECEIVE_COMMENT', {
      bookId: book._id,
      drawingId: drawing._id,
      commentId: comment._id
    });

    res.status(201).json({
      comment,
      pointsAwarded: pointsResult?.pointsAwarded || 0,
      newAchievements: pointsResult?.newAchievements || []
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment
router.delete('/:bookId/drawings/:drawingId/comments/:commentId', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const drawing = book.drawings.id(req.params.drawingId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    const comment = drawing.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is authorized to delete the comment
    if (comment.userId.toString() !== req.user._id.toString() && 
        drawing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await book.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all comments for a drawing
router.get('/:bookId/drawings/:drawingId/comments', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const drawing = book.drawings.id(req.params.drawingId);
    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json(drawing.comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// backend/src/routes/books.js
// Add this route for deleting drawings
// router.delete('/:bookId/drawings/:drawingId', auth, async (req, res) => {
//   try {
//     console.log('Attempting to delete drawing:', req.params.drawingId);
//     const book = await Book.findById(req.params.bookId);
    
//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     // Find the drawing index
//     const drawingIndex = book.drawings.findIndex(
//       drawing => drawing._id.toString() === req.params.drawingId
//     );

//     if (drawingIndex === -1) {
//       return res.status(404).json({ error: 'Drawing not found' });
//     }

//     // Remove the drawing
//     book.drawings.splice(drawingIndex, 1);
//     await book.save();
    
//     console.log('Drawing deleted successfully');
//     res.json({ message: 'Drawing deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting drawing:', error);
//     res.status(400).json({ error: error.message });
//   }
// });

// // Update book (admin only)
// router.put('/:id', [auth, adminAuth], async (req, res) => {
//   try {
//     const { title, author, description, ageRange } = req.body;
    
//     const book = await Book.findByIdAndUpdate(
//       req.params.id,
//       {
//         title,
//         author,
//         description,
//         ageRange
//       },
//       { new: true }
//     );

//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     res.json(book);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Delete book (admin only)
// router.delete('/:id', [auth, adminAuth], async (req, res) => {
//   try {
//     const book = await Book.findByIdAndDelete(req.params.id);
    
//     if (!book) {
//       return res.status(404).json({ error: 'Book not found' });
//     }

//     res.json({ message: 'Book deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Get book statistics (admin only)
// router.get('/stats', [auth, adminAuth], async (req, res) => {
//   try {
//     const totalBooks = await Book.countDocuments();
//     const books = await Book.find({});
    
//     const stats = {
//       totalBooks,
//       totalDrawings: books.reduce((sum, book) => sum + book.drawings.length, 0),
//       activeUsers: new Set(books.flatMap(book => 
//         book.drawings.map(drawing => drawing.userId)
//       )).size,
//       booksPerAgeGroup: books.reduce((acc, book) => {
//         const ageGroup = `${book.ageRange.min}-${book.ageRange.max}`;
//         acc[ageGroup] = (acc[ageGroup] || 0) + 1;
//         return acc;
//       }, {})
//     };

//     res.json(stats);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

export default router;