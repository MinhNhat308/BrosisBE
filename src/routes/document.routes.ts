import express from 'express';
import { 
  getAllDocumentTypes,
  getStudentDocuments,
  updateDocumentStatus,
  createDefaultDocuments
} from '../controllers/document.controller';

const router = express.Router();

// Get all document types
router.get('/', getAllDocumentTypes);

// Get documents for a specific student
router.get('/student/:studentId', getStudentDocuments);

// Create default documents for a student
router.post('/student/:studentId/create-defaults', createDefaultDocuments);

// Update document submission status
router.put('/:documentId/status', updateDocumentStatus);

export default router;
