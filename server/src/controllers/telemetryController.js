import Reading from '../models/Reading.js';
import Sensor from '../models/Sensor.js';
import { getOrCreateDetectorSession } from '../services/detectorService.js';
import { broadcastTelemetryPacket } from '../config/socket.js';

// Rolling buffer to batch-write readings into MongoDB once per second
const pendingBuckets = new Map();

/**
 * Shared ingestion core used by both real ESP32 HTTP requests and the Simulator
 */
export const processTelemetryPayload = async (payload) => {
  const { sensorId, timestamp = Date.now(), samples = [], battery, rssi } = payload;
  if (!sensorId || samples.length === 0) return null;

  // 1. Fetch or cache sensor definition
  let sensor = await Sensor.findOne({ sensorId });
  if (!sensor) {
    // Auto-register discovered sensor
    sensor = await Sensor.create({
      sensorId,
      name: `Sensor ${sensorId}`,
      apiKey: payload.apiKey || 'default_key',
      status: 'ONLINE',
      lastPing: new Date(timestamp)
    });
  } else {
    // Update last ping and online status
    sensor.status = sensor.status === 'SIMULATED' ? 'SIMULATED' : 'ONLINE';
    sensor.lastPing = new Date(timestamp);
    await sensor.save();
  }

  // 2. Feed into Infrasound Signal Processing & STA/LTA Detector
  const detector = getOrCreateDetectorSession(sensor);
  const detectionResult = await detector.processIncomingPacket(samples);

  // 3. Emit real-time packet via Socket.IO
  const telemetryPacket = {
    sensorId,
    timestamp,
    samples: detectionResult.processedSamples,
    latestRatio: detectionResult.latestRatio,
    isTriggered: detectionResult.isTriggered,
    battery,
    rssi
  };

  broadcastTelemetryPacket(sensorId, telemetryPacket);

  // 4. Batch and persist 1-second Reading bucket to MongoDB
  if (!pendingBuckets.has(sensorId)) {
    pendingBuckets.set(sensorId, {
      sensorId,
      timestamp: new Date(timestamp),
      samples: [],
      minPressure: 9999,
      maxPressure: -9999,
      sumPressure: 0
    });
  }

  const bucket = pendingBuckets.get(sensorId);
  detectionResult.processedSamples.forEach(s => {
    bucket.samples.push(s);
    if (s.pressurePa < bucket.minPressure) bucket.minPressure = s.pressurePa;
    if (s.pressurePa > bucket.maxPressure) bucket.maxPressure = s.pressurePa;
    bucket.sumPressure += s.pressurePa;
  });

  // When bucket contains >= 20 samples (~1 second of telemetry), save to DB
  if (bucket.samples.length >= 20) {
    const avg = Number((bucket.sumPressure / bucket.samples.length).toFixed(3));
    const newReading = new Reading({
      sensorId,
      timestamp: bucket.timestamp,
      sampleCount: bucket.samples.length,
      samples: bucket.samples,
      stats: {
        minPressure: bucket.minPressure,
        maxPressure: bucket.maxPressure,
        avgPressure: avg
      }
    });

    // Fire-and-forget save to keep ingestion loop fast
    newReading.save().catch(err => console.error('[Telemetry] Reading save error:', err.message));
    pendingBuckets.delete(sensorId);
  }

  return telemetryPacket;
};

/**
 * Controller endpoint for ESP32 hardware via HTTP POST /api/v1/telemetry/submit
 */
export const submitTelemetry = async (req, res, next) => {
  try {
    const result = await processTelemetryPayload(req.body);
    if (!result) {
      return res.status(400).json({ success: false, message: 'Invalid telemetry payload.' });
    }

    res.status(200).json({
      success: true,
      message: 'Telemetry ingested and processed successfully.',
      sensorId: req.body.sensorId,
      samplesReceived: req.body.samples?.length || 0,
      staLtaRatio: result.latestRatio,
      isTriggered: result.isTriggered
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Query historical readings
 */
export const getSensorReadings = async (req, res, next) => {
  try {
    const { sensorId } = req.params;
    const { limit = 60, from, to } = req.query;

    const query = { sensorId };
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const readings = await Reading.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings.reverse() // Chronological order
    });
  } catch (error) {
    next(error);
  }
};
