const express = require('express');
const { chatWithAI, getChatHistory } = require('../controllers/aiController');
const { protect, studentOnly } = require('../middleware/auth');

const router = express.Router();

// All AI routes require authentication and are for students only
router.use(protect);
router.use(studentOnly);

// AI Tutor routes
router.post('/chat', chatWithAI);        // POST /api/ai/chat - Send message to AI tutor
router.get('/history', getChatHistory);  // GET /api/ai/history - Get chat history

module.exports = router;