import express from 'express';
import {
	submitDemoRequest,
	getAllDemoRequests,
	getDemoRequestById,
	updateDemoRequestStatus,
	deleteDemoRequest
} from '../controllers/demo-controllers.js';

const router = express.Router();

// Public route - Submit demo request
router.post('/demo-request', submitDemoRequest);

// Admin routes (protected)
router.get('/admin/demo-requests', getAllDemoRequests);
router.get('/admin/demo-requests/:id', getDemoRequestById);
router.put('/admin/demo-requests/:id', updateDemoRequestStatus);
router.delete('/admin/demo-requests/:id', deleteDemoRequest);

export default router;
