import express from 'express';
import { getReports, createReport, downloadEventsCSV } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getReports);
router.post('/generate', createReport);
router.get('/export/csv', downloadEventsCSV);

export default router;
