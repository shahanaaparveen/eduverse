const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema - defines the structure of user data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'teacher'], // Only these two roles are allowed
    required: [true, 'Role is required']
  },
  // Array of classroom IDs the user belongs to
  classrooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom'
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if entered password matches hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);