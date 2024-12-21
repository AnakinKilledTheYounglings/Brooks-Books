// backend/src/routes/users.js
import express from 'express';
import User from '../models/User.js';
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    res.json(users); // Send the list of users back as JSON
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
