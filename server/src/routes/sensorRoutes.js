import express from 'express';
import { getSensors, getSensorById, createSensor, updateSensor, deleteSensor } from '../controllers/sensorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); // All sensor routes require authenticated session

router.get('/', getSensors);
router.get('/:id', getSensorById);

// Admin-only management endpoints
router.post('/', authorize('ADMIN'), createSensor);
router.put('/:id', authorize('ADMIN'), updateSensor);
router.delete('/:id', authorize('ADMIN'), deleteSensor);

export default router;
