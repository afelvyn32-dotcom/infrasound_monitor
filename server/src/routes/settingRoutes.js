import express from 'express';
import { getSettings, updateSetting, triggerSimulationEvent, toggleSimulatorRunning } from '../controllers/settingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getSettings);
router.put('/', updateSetting);
router.post('/trigger-simulation', triggerSimulationEvent);
router.post('/toggle-simulator', toggleSimulatorRunning);

export default router;
