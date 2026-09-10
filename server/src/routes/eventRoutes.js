import express from 'express';
import { getEvents, getEventById, updateEventStatus, getEventStats } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getEvents);
router.get('/stats/summary', getEventStats);
router.get('/:id', getEventById);

// Admin validation endpoint
router.put('/:id/status', authorize('ADMIN'), updateEventStatus);

export default router;
