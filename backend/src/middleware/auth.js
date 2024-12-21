// backend/src/middleware/auth.js

import jwt from 'jsonwebtoken';

// backend/src/middleware/auth.js

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Include isAdmin in the user object
      req.user = {
        _id: decoded.userId,
        userId: decoded.userId,
        isAdmin: decoded.isAdmin // Make sure this is included
      };

      console.log('Auth middleware - User set:', req.user); // Debug log
      next();
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

export default auth