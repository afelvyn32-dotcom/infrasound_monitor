import mongoose from 'mongoose';

const ReadingSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  sampleCount: {
    type: Number,
    required: true
  },
  samples: [{
    offsetMs: { type: Number, required: true },
    pressurePa: { type: Number, required: true }, // Dynamic infrasound acoustic variation (Pascals)
    rawPressure: { type: Number } // Absolute atmospheric pressure (hPa)
  }],
  stats: {
    minPressure: Number,
    maxPressure: Number,
    avgPressure: Number,
    rmsEnergy: Number
  }
}, { timestamps: true });

// Compound index for range queries
ReadingSchema.index({ sensorId: 1, timestamp: -1 });

export default mongoose.model('Reading', ReadingSchema);
