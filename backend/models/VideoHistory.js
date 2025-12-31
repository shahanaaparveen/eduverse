const mongoose = require('mongoose');

// VideoHistory Schema - tracks what educational videos students have watched
const videoHistorySchema = new mongoose.Schema({
  // Reference to the student who watched the video
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // YouTube video ID
  videoId: {
    type: String,
    required: true
  },
  // Video title for easy reference
  videoTitle: {
    type: String,
    required: true
  },
  // Video thumbnail URL
  thumbnail: {
    type: String
  },
  // Duration watched in seconds
  watchDuration: {
    type: Number,
    default: 0
  },
  // Total video duration in seconds
  totalDuration: {
    type: Number
  },
  // Whether the video was completed
  completed: {
    type: Boolean,
    default: false
  },
  watchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('VideoHistory', videoHistorySchema);