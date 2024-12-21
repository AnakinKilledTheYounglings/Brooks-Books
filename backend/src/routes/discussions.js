// backend/src/routes/discussions.js
import express from 'express';
import auth from '../middleware/auth.js';
import Discussion from '../models/Discussion.js';

const router = express.Router();

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const discussions = await Discussion.find({ isHidden: false })
      .populate('author', 'username')
      .populate('bookId', 'title')
      .sort({ createdAt: -1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new discussion
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, bookId, mediaUrl, mediaType } = req.body;
    const discussion = new Discussion({
      title,
      content,
      author: req.user._id,
      bookId,
      mediaUrl,
      mediaType
    });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add comment to discussion
router.post('/:discussionId/comments', auth, async (req, res) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    const discussion = await Discussion.findById(req.params.discussionId);
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    const comment = {
      content,
      mediaUrl,
      mediaType,
      author: req.user._id,
      username: req.user.username, // Add username for easy display
      createdAt: new Date()
    };

    discussion.comments.push(comment);
    await discussion.save();

    res.status(201).json(discussion);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Report discussion or comment
router.post('/:discussionId/report', auth, async (req, res) => {
  try {
    const { reason, commentId } = req.body;
    const discussion = await Discussion.findById(req.params.discussionId);
    
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }

    if (commentId) {
      // Report a comment
      const comment = discussion.comments.id(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      comment.reports.push({
        reportedBy: req.user._id,
        reason
      });
      comment.isHidden = true; // Hide comment until reviewed
    } else {
      // Report the discussion
      discussion.reports.push({
        reportedBy: req.user._id,
        reason
      });
      discussion.isHidden = true; // Hide discussion until reviewed
    }

    await discussion.save();
    res.json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;