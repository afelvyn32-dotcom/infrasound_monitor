import express from 'express';
import { submitTelemetry, getSensorReadings } from '../controllers/telemetryController.js';
import { verifySensorApiKey } from '../middleware/sensorAuth.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ESP32 Hardware ingestion endpoint (secured by x-sensor-id & x-api-key)
router.post('/submit', verifySensorApiKey, submitTelemetry);

// Historical telemetry query for charts
router.get('/readings/:sensorId', protect, getSensorReadings);

export default router;
