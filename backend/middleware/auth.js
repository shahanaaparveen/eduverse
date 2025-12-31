const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - checks if user is authenticated
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (remove 'Bearer ' prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and add to request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware to check if user has teacher role
const teacherOnly = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next(); // User is a teacher, continue
  } else {
    res.status(403).json({ message: 'Access denied. Teachers only.' });
  }
};

// Middleware to check if user has student role
const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next(); // User is a student, continue
  } else {
    res.status(403).json({ message: 'Access denied. Students only.' });
  }
};

module.exports = { protect, teacherOnly, studentOnly };