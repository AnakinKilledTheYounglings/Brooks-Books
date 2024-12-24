// backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { upload, uploadToS3 } from '../middleware/upload.js';
import Book from '../models/Book.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, age, isAdmin } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      username,
      email,
      password: hashedPassword,
      age,
      isAdmin: isAdmin || false
    });

    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('Login request received:', {
      body: req.body,
      headers: req.headers
    });
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ 
      userId: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        userId: user._id,
        username: user.username,
        age: user.age,
        points: user.points,
        badges: user.badges,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto // Added this line
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Profile route
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.userId);
    const user = await User.findById(req.user.userId || req.user._id)
      .select('-password')
      .populate('completedBooks');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User profile data:', {
      id: user._id,
      username: user.username,
      profilePhoto: user.profilePhoto
    });

    res.json({
      id: user._id,
      userId: user._id,
      username: user.username,
      profilePhoto: user.profilePhoto,
      email: user.email,
      age: user.age,
      bio: user.bio,
      points: user.points,
      drawings: user.drawings,
      achievements: user.achievements,
      completedBooks: user.completedBooks,
      totalLikes: user.totalLikes,
      pointsHistory: user.pointsHistory,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Photo upload route with enhanced logging
router.post('/profile/photo', auth, upload.single('photo'), async (req, res) => {
  try {
    console.log('Starting photo upload process');
    
    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File received:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const imageUrl = await uploadToS3(req.file);
    console.log('S3 upload successful, URL:', imageUrl);

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePhoto: imageUrl },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      console.log('User not found during update');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Database update successful:', {
      userId: updatedUser._id,
      profilePhoto: updatedUser.profilePhoto
    });

    res.json({
      profilePhoto: imageUrl,
      message: 'Profile photo updated successfully'
    });
  } catch (error) {
    console.error('Profile photo upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Profile Drawings route
router.get('/profile/drawings', auth, async (req, res) => {
  try {
    console.log('Fetching drawings for user:', req.user.userId);
    
    const books = await Book.find({
      'drawings.userId': req.user.userId
    });
    
    console.log('Found books:', books.length);

    let allDrawings = [];
    books.forEach(book => {
      const bookDrawings = book.drawings
        .filter(drawing => drawing.userId.toString() === req.user.userId.toString())
        .map(drawing => ({
          ...drawing.toObject(),
          bookTitle: book.title
        }));
      allDrawings = [...allDrawings, ...bookDrawings];
    });

    console.log('Processed drawings:', allDrawings.length);
    res.json(allDrawings);
  } catch (error) {
    console.error('Error fetching drawings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch drawings',
      details: error.message 
    });
  }
});


// Add a route to update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, bio } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (username) user.username = username;
    if (bio) user.bio = bio;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Email update route
router.patch('/user/update', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (updates.email) {
      user.email = updates.email;
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//path email to make user admin
router.patch('/user/makeAdmin/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: true },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated to admin', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Check users route
// In auth.js, update the users/check route:
router.get('/users/check', async (req, res) => {
    try {
      console.log('Checking users...');
      const users = await User.find({}).select('username email isAdmin');
      console.log('Found users:', users);  // Debug log
      res.json(users);
    } catch (error) {
      console.error('Error checking users:', error);
      res.status(400).json({ error: error.message });
    }
  });

// Delete user route
router.delete('/user/delete/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


export default router;