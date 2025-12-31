const Classroom = require('../models/Classroom');
const User = require('../models/User');

// Generate random classroom code
const generateClassCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Create new classroom (Teachers only)
const createClassroom = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Generate unique class code
    let classCode;
    let codeExists = true;
    
    while (codeExists) {
      classCode = generateClassCode();
      const existingClass = await Classroom.findOne({ classCode });
      if (!existingClass) {
        codeExists = false;
      }
    }

    const classroom = await Classroom.create({
      name,
      description,
      teacher: req.user._id,
      classCode
    });

    // Add classroom to teacher's classrooms array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { classrooms: classroom._id }
    });

    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all classrooms for current user
const getClassrooms = async (req, res) => {
  try {
    let classrooms;
    
    if (req.user.role === 'teacher') {
      // Teachers see classrooms they created
      classrooms = await Classroom.find({ teacher: req.user._id })
        .populate('students', 'name email')
        .populate('teacher', 'name email');
    } else {
      // Students see classrooms they're enrolled in
      classrooms = await Classroom.find({ students: req.user._id })
        .populate('students', 'name email')
        .populate('teacher', 'name email');
    }

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Join classroom using class code (Students only)
const joinClassroom = async (req, res) => {
  try {
    const { classCode } = req.body;

    const classroom = await Classroom.findOne({ classCode });
    if (!classroom) {
      return res.status(404).json({ message: 'Invalid class code' });
    }

    // Check if student is already enrolled
    if (classroom.students.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this classroom' });
    }

    // Add student to classroom
    classroom.students.push(req.user._id);
    await classroom.save();

    // Add classroom to student's classrooms array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { classrooms: classroom._id }
    });

    res.json({ message: 'Successfully joined classroom', classroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single classroom details
const getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id)
      .populate('students', 'name email')
      .populate('teacher', 'name email');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if user has access to this classroom
    const hasAccess = classroom.teacher._id.toString() === req.user._id.toString() ||
                     classroom.students.some(student => student._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete classroom (Teachers only)
const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    // Check if user is the teacher of this classroom
    if (classroom.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only the teacher can delete this classroom.' });
    }

    // Remove classroom from all users' classrooms arrays
    await User.updateMany(
      { classrooms: classroom._id },
      { $pull: { classrooms: classroom._id } }
    );

    // Delete the classroom
    await Classroom.findByIdAndDelete(req.params.id);

    res.json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClassroom,
  getClassrooms,
  joinClassroom,
  getClassroom,
  deleteClassroom,
};