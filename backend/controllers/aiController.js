// AI Tutor Controller - handles AI chat functionality
// Note: This uses dummy responses initially. You can integrate Gemini AI later.

// Dummy AI responses for different types of questions
const dummyResponses = {
  math: [
    "Let me help you with that math problem! Can you break it down step by step?",
    "Math can be tricky, but let's solve this together. What specific part are you struggling with?",
    "Great question! For math problems like this, I recommend starting with the basics and working your way up."
  ],
  science: [
    "Science is fascinating! Let me explain this concept in simple terms.",
    "That's an excellent science question. Let's explore this topic together.",
    "Science concepts can be complex, but I'll help you understand it step by step."
  ],
  general: [
    "That's a great question! Let me help you understand this better.",
    "I'm here to help you learn. Can you provide more details about what you're studying?",
    "Learning is a journey, and I'm here to guide you. What would you like to know more about?"
  ]
};

// Function to get a random response based on question type
const getRandomResponse = (type) => {
  const responses = dummyResponses[type] || dummyResponses.general;
  return responses[Math.floor(Math.random() * responses.length)];
};

// Function to detect question type based on keywords
const detectQuestionType = (question) => {
  const mathKeywords = ['math', 'calculate', 'equation', 'solve', 'number', 'algebra', 'geometry'];
  const scienceKeywords = ['science', 'physics', 'chemistry', 'biology', 'experiment', 'theory'];
  
  const lowerQuestion = question.toLowerCase();
  
  if (mathKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'math';
  } else if (scienceKeywords.some(keyword => lowerQuestion.includes(keyword))) {
    return 'science';
  } else {
    return 'general';
  }
};

// Handle AI chat request
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Detect question type
    const questionType = detectQuestionType(message);
    
    // Get dummy response (replace this with actual Gemini AI integration later)
    const aiResponse = getRandomResponse(questionType);
    
    // Simulate AI thinking time
    setTimeout(() => {
      res.json({
        message: aiResponse,
        type: questionType,
        timestamp: new Date().toISOString()
      });
    }, 1000);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history (placeholder for future implementation)
const getChatHistory = async (req, res) => {
  try {
    // This would typically fetch from a ChatHistory model
    // For now, return empty array
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
FUTURE GEMINI AI INTEGRATION:
To integrate with actual Gemini AI, replace the chatWithAI function with:

const { GoogleGenerativeAI } = require("@google/generative-ai");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    
    res.json({
      message: text,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

module.exports = {
  chatWithAI,
  getChatHistory,
};