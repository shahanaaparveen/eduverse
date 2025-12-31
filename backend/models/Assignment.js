const mongoose = require('mongoose');

// Assignment Schema - defines the structure of assignment data
const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required']
  },
  // Reference to the classroom this assignment belongs to
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  // Reference to the teacher who created this assignment
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  maxPoints: {
    type: Number,
    default: 100
  },
  // Array of file attachments for the assignment
  attachments: [{
    filename: String,
    fileUrl: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);