// backend/src/routes/recommendations.js
import express from 'express';
import graphService from '../services/graphService.js';
import auth from '../middleware/auth.js';
import { syncBooksToGraph } from '../utils/graphSync.js';

const router = express.Router();

// Get similar books
router.get('/similar/:bookId', async (req, res) => {
  try {
    const similarBooks = await graphService.findSimilarBooks(req.params.bookId);
    res.json(similarBooks);
  } catch (error) {
    console.error('Error finding similar books:', error);
    res.status(500).json({ error: 'Failed to find similar books' });
  }
});

// Get personalized recommendations for user
router.get('/user', auth, async (req, res) => {
  try {
    const recommendations = await graphService.getBookRecommendations(req.user._id);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get books by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    const books = await graphService.findBooksByTag(req.params.tag);
    res.json(books);
  } catch (error) {
    console.error('Error finding books by tag:', error);
    res.status(500).json({ error: 'Failed to find books by tag' });
  }
});

// Get full graph data for visualization
router.get('/graph', async (req, res) => {
  try {
    console.log('Received graph request with query params:', req.query);
    const { nodeType, value } = req.query;
    const filters = {};
    
    if (nodeType) {
      filters.nodeType = nodeType;
      if (value) {
        filters.value = value;
      }
    }

    console.log('Applying filters:', filters);
    const graphData = await graphService.getFullGraph(filters);
    console.log('Graph data returned successfully');
    res.json(graphData);
  } catch (error) {
    console.error('Detailed error in /graph route:', error);
    res.status(500).json({ 
      error: 'Failed to fetch graph data',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post('/sync', async (req, res) => {
  try {
    console.log('Starting graph sync...');
    await syncBooksToGraph();
    console.log('Graph sync completed');
    res.json({ message: 'Graph sync completed successfully' });
  } catch (error) {
    console.error('Detailed sync error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'Failed to sync graph',
      details: error.message 
    });
  }
});

export default router;