import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true }
  },
  sensorsIncluded: [{
    type: String
  }],
  totalEventsLogged: {
    type: Number,
    default: 0
  },
  format: {
    type: String,
    enum: ['PDF', 'CSV', 'JSON'],
    default: 'CSV'
  },
  downloadUrl: {
    type: String,
    default: ''
  },
  summaryStats: {
    maxRecordedPressurePa: { type: Number, default: 0 },
    averageRmsEnergy: { type: Number, default: 0 },
    primaryEventType: { type: String, default: 'None' }
  }
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);
