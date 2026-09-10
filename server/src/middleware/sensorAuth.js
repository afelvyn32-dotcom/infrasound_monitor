import Sensor from '../models/Sensor.js';

export const verifySensorApiKey = async (req, res, next) => {
  const sensorId = req.headers['x-sensor-id'] || req.body.sensorId;
  const apiKey = req.headers['x-api-key'] || req.body.apiKey;

  if (!sensorId || !apiKey) {
    return res.status(401).json({
      success: false,
      message: 'Telemetry ingestion rejected: Missing sensorId or apiKey header/body.'
    });
  }

  try {
    const sensor = await Sensor.findOne({ sensorId });
    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: `Sensor '${sensorId}' is not registered in the system.`
      });
    }

    if (sensor.apiKey !== apiKey) {
      return res.status(403).json({
        success: false,
        message: 'Invalid sensor API key. Authentication failed.'
      });
    }

    req.sensor = sensor;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Sensor authentication error: ${error.message}`
    });
  }
};
