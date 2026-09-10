import mongoose from 'mongoose';

const InfrasoundEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sensorId: {
    type: String,
    required: true,
    index: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    default: null
  },
  durationSec: {
    type: Number,
    default: 0.0
  },
  peakAmplitudePa: {
    type: Number,
    required: true
  },
  dominantFrequencyHz: {
    type: Number,
    default: 1.0
  },
  staLtaRatio: {
    type: Number,
    default: 3.5
  },
  detectionMethod: {
    type: String,
    enum: ['STA_LTA', 'PEAK_THRESHOLD', 'MANUAL'],
    default: 'STA_LTA'
  },
  classification: {
    type: String,
    enum: ['UNCLASSIFIED', 'SEISMIC', 'EXPLOSION', 'SEVERE_WEATHER', 'VOLCANIC', 'EQUIPMENT_NOISE'],
    default: 'UNCLASSIFIED'
  },
  status: {
    type: String,
    enum: ['DETECTED', 'VERIFIED', 'FALSE_POSITIVE', 'RESOLVED'],
    default: 'DETECTED'
  },
  notes: {
    type: String,
    default: ''
  },
  waveformSnapshot: [{
    offsetMs: Number,
    pressurePa: Number
  }]
}, { timestamps: true });

export default mongoose.model('InfrasoundEvent', InfrasoundEventSchema);
