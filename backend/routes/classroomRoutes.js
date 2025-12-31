const express = require('express');
const {
  createClassroom,
  getClassrooms,
  joinClassroom,
  getClassroom,
  deleteClassroom,
} = require('../controllers/classroomController');
const { protect, teacherOnly, studentOnly } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Classroom routes
router.route('/')
  .get(getClassrooms)                    // GET /api/classrooms - Get all classrooms for user
  .post(teacherOnly, createClassroom);   // POST /api/classrooms - Create new classroom (teachers only)

router.post('/join', studentOnly, joinClassroom); // POST /api/classrooms/join - Join classroom (students only)

router.get('/:id', getClassroom);        // GET /api/classrooms/:id - Get single classroom
router.delete('/:id', teacherOnly, deleteClassroom); // DELETE /api/classrooms/:id - Delete classroom (teachers only)

module.exports = router;