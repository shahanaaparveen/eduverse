const mongoose = require('mongoose');

// Classroom Schema - defines the structure of classroom data
const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Classroom name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Reference to the teacher who created this classroom
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Array of student IDs enrolled in this classroom
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Classroom code for students to join
  classCode: {
    type: String,
    unique: true,
    required: true
  },
  // Array of materials uploaded by teacher
  materials: [{
    title: String,
    description: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);