const express = require('express');
const {
  searchVideos,
  getTrendingVideos,
  saveToHistory,
  getWatchHistory,
} = require('../controllers/youtubeController');
const { protect, studentOnly } = require('../middleware/auth');

const router = express.Router();

// All YouTube routes require authentication and are for students only
router.use(protect);
router.use(studentOnly);

// YouTube routes
router.get('/search', searchVideos);      // GET /api/youtube/search?query=math - Search educational videos
router.get('/trending', getTrendingVideos); // GET /api/youtube/trending - Get trending educational videos
router.post('/history', saveToHistory);   // POST /api/youtube/history - Save video to watch history
router.get('/history', getWatchHistory);  // GET /api/youtube/history - Get user's watch history

module.exports = router;