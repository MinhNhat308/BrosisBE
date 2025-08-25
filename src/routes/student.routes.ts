import express from 'express';
import {
  getAllStudents,
  getStudentStatistics,
  getStudentById,
  updateStudentStatus
} from '../controllers/student.controller.real';
import { validateStudent } from '../controllers/student.controller';

const router = express.Router();

// Get all students
router.get('/', getAllStudents);

// Get statistics
router.get('/statistics', getStudentStatistics);
router.get('/stats', getStudentStatistics);

// Validate student by MSSV
router.post('/validate', validateStudent);

// Update student status
router.put('/:id/status', updateStudentStatus);

// Get student by ID
router.get('/:id', getStudentById);

export default router;
