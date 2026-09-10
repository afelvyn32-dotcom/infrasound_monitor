import Reading from '../models/Reading.js';
import InfrasoundEvent from '../models/InfrasoundEvent.js';
import Report from '../models/Report.js';

export const generateSummaryReport = async ({ userId, title, fromDate, toDate, format = 'CSV', sensors = [] }) => {
  const query = {};
  if (fromDate || toDate) {
    query.startTime = {};
    if (fromDate) query.startTime.$gte = new Date(fromDate);
    if (toDate) query.startTime.$lte = new Date(toDate);
  }
  if (sensors.length > 0) {
    query.sensorId = { $in: sensors };
  }

  const events = await InfrasoundEvent.find(query).sort({ startTime: -1 });

  let maxPressure = 0;
  events.forEach(evt => {
    if (evt.peakAmplitudePa > maxPressure) maxPressure = evt.peakAmplitudePa;
  });

  const report = new Report({
    title: title || `Infrasound Analysis Report - ${new Date().toLocaleDateString()}`,
    generatedBy: userId,
    dateRange: {
      from: fromDate ? new Date(fromDate) : new Date(Date.now() - 7 * 24 * 3600 * 1000),
      to: toDate ? new Date(toDate) : new Date()
    },
    sensorsIncluded: sensors,
    totalEventsLogged: events.length,
    format,
    summaryStats: {
      maxRecordedPressurePa: maxPressure,
      averageRmsEnergy: Number((events.reduce((acc, curr) => acc + (curr.peakAmplitudePa || 0), 0) / Math.max(1, events.length)).toFixed(2)),
      primaryEventType: events.length > 0 ? events[0].classification : 'None'
    }
  });

  await report.save();
  return { report, events };
};

export const exportEventsToCSV = (events) => {
  const headers = ['Event ID', 'Sensor ID', 'Start Time', 'End Time', 'Duration (s)', 'Peak Amplitude (Pa)', 'Dominant Freq (Hz)', 'Classification', 'Status'];
  const rows = events.map(e => [
    e.eventId,
    e.sensorId,
    new Date(e.startTime).toISOString(),
    e.endTime ? new Date(e.endTime).toISOString() : 'Ongoing',
    e.durationSec || 0,
    e.peakAmplitudePa,
    e.dominantFrequencyHz,
    e.classification,
    e.status
  ]);

  return [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
};
