// backend/src/routes/gifs.js
import express from 'express';
import { searchGifs, getTrendingGifs, testTenorAPI } from '../services/tenorService.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    console.log('Received search request with query:', req.query);
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const gifs = await searchGifs(q);
    console.log('GIFs fetched successfully:', gifs ? gifs.length : 0);
    res.json(gifs);
  } catch (error) {
    console.error('GIF search error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/trending', async (req, res) => {
  try {
    console.log('Fetching trending GIFs');
    const gifs = await getTrendingGifs();
    console.log('Trending GIFs fetched successfully:', gifs ? gifs.length : 0);
    res.json(gifs);
  } catch (error) {
    console.error('Trending GIFs error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/test', async (req, res) => {
  const isWorking = await testTenorAPI();
  res.json({ 
    success: isWorking,
    message: isWorking ? 'Tenor API is working correctly' : 'Tenor API test failed'
  });
});

export default router;