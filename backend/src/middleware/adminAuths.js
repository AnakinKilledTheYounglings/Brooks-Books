// backend/src/middleware/adminAuth.js
const adminAuth = async (req, res, next) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    } catch (error) {
      res.status(401).json({ error: 'Admin authorization failed' });
    }
  };
  
  export default adminAuth;