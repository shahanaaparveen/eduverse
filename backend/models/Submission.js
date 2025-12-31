const mongoose = require('mongoose');

// Submission Schema - defines the structure of assignment submission data
const submissionSchema = new mongoose.Schema({
  // Reference to the assignment this submission is for
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  // Reference to the student who submitted this
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Text content of the submission
  content: {
    type: String,
    required: [true, 'Submission content is required']
  },
  // Array of file attachments
  attachments: [{
    filename: String,
    fileUrl: String
  }],
  // Grading information
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  },
  // Status of the submission
  status: {
    type: String,
    enum: ['submitted', 'graded', 'returned'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  gradedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);