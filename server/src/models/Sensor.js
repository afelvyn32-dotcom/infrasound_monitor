import mongoose from 'mongoose';

const SensorSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    name: { type: String, default: 'Station Alpha' },
    latitude: { type: Number, default: 0.0 },
    longitude: { type: Number, default: 0.0 },
    elevationMeters: { type: Number, default: 120 }
  },
  status: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'MAINTENANCE', 'SIMULATED'],
    default: 'SIMULATED'
  },
  apiKey: {
    type: String,
    required: true
  },
  samplingRateHz: {
    type: Number,
    default: 20
  },
  calibrationOffset: {
    type: Number,
    default: 0.0
  },
  thresholds: {
    staWindowSec: { type: Number, default: 2 },
    ltaWindowSec: { type: Number, default: 20 },
    triggerRatio: { type: Number, default: 3.5 },
    detriggerRatio: { type: Number, default: 1.5 },
    maxPressurePa: { type: Number, default: 15.0 }
  },
  lastPing: {
    type: Date,
    default: null
  },
  metadata: {
    hardwareType: { type: String, default: 'ESP32-WROOM-32 + BMP280' },
    firmwareVersion: { type: String, default: 'v1.0.4' },
    ipAddress: { type: String, default: '192.168.1.104' }
  }
}, { timestamps: true });

export default mongoose.model('Sensor', SensorSchema);
