import express from 'express';
import { getAlerts, acknowledgeAlert, acknowledgeAllAlerts } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAlerts);
router.put('/acknowledge-all', acknowledgeAllAlerts);
router.put('/:id/ack', acknowledgeAlert);

export default router;
