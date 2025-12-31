const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerUser); // POST /api/auth/register
router.post('/login', loginUser);       // POST /api/auth/login

// Protected routes (authentication required)
router.get('/profile', protect, getUserProfile); // GET /api/auth/profile

module.exports = router;