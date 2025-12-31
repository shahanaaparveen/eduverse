const VideoHistory = require('../models/VideoHistory');

// Educational keywords for filtering YouTube videos
const educationalKeywords = [
  'tutorial', 'lesson', 'education', 'learning', 'course', 'lecture',
  'math', 'science', 'physics', 'chemistry', 'biology', 'history',
  'geography', 'english', 'literature', 'programming', 'coding'
];

// Dummy educational videos (replace with actual YouTube API later)
const dummyVideos = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Introduction to Algebra - Basic Concepts',
    description: 'Learn the fundamentals of algebra in this comprehensive tutorial.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    duration: '15:30',
    channel: 'Math Academy'
  },
  {
    id: 'jNQXAC9IVRw',
    title: 'Physics: Understanding Motion and Forces',
    description: 'Explore the basic principles of motion and forces in physics.',
    thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    duration: '22:45',
    channel: 'Science Explained'
  },
  {
    id: 'y8Kyi0WNg40',
    title: 'World History: Ancient Civilizations',
    description: 'Journey through ancient civilizations and their contributions.',
    thumbnail: 'https://img.youtube.com/vi/y8Kyi0WNg40/maxresdefault.jpg',
    duration: '18:20',
    channel: 'History Hub'
  }
];

// Search educational videos
const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Filter dummy videos based on search query
    const filteredVideos = dummyVideos.filter(video => 
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      videos: filteredVideos,
      totalResults: filteredVideos.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending educational videos
const getTrendingVideos = async (req, res) => {
  try {
    // Return all dummy videos as trending
    res.json({
      videos: dummyVideos,
      totalResults: dummyVideos.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save video to watch history
const saveToHistory = async (req, res) => {
  try {
    const { videoId, videoTitle, thumbnail, watchDuration, totalDuration } = req.body;

    // Check if video already exists in history
    let videoHistory = await VideoHistory.findOne({
      student: req.user._id,
      videoId
    });

    if (videoHistory) {
      // Update existing record
      videoHistory.watchDuration = watchDuration;
      videoHistory.completed = watchDuration >= totalDuration * 0.9; // 90% completion
      videoHistory.watchedAt = new Date();
      await videoHistory.save();
    } else {
      // Create new record
      videoHistory = await VideoHistory.create({
        student: req.user._id,
        videoId,
        videoTitle,
        thumbnail,
        watchDuration,
        totalDuration,
        completed: watchDuration >= totalDuration * 0.9
      });
    }

    res.json({ message: 'Video saved to history', videoHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's watch history
const getWatchHistory = async (req, res) => {
  try {
    const history = await VideoHistory.find({ student: req.user._id })
      .sort({ watchedAt: -1 })
      .limit(50);

    // If no history, return sample data for testing
    if (history.length === 0) {
      const sampleHistory = [
        {
          _id: '1',
          videoTitle: 'Algebra Basics',
          watchDuration: 450,
          totalDuration: 500,
          completed: false
        },
        {
          _id: '2', 
          videoTitle: 'Physics Motion',
          watchDuration: 600,
          totalDuration: 600,
          completed: true
        },
        {
          _id: '3',
          videoTitle: 'Chemistry Bonds',
          watchDuration: 200,
          totalDuration: 400,
          completed: false
        }
      ];
      return res.json(sampleHistory);
    }

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 
FUTURE YOUTUBE API INTEGRATION:
To integrate with actual YouTube Data API, replace the functions with:

const axios = require('axios');

const searchVideos = async (req, res) => {
  try {
    const { query } = req.query;
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query + ' education tutorial',
        type: 'video',
        videoCategoryId: '27', // Education category
        maxResults: 20,
        key: process.env.YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.channelTitle
    }));

    res.json({ videos, totalResults: response.data.pageInfo.totalResults });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

module.exports = {
  searchVideos,
  getTrendingVideos,
  saveToHistory,
  getWatchHistory,
};