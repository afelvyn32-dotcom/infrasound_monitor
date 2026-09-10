/**
 * Centralized Mock Dataset Hub for Infrasound Monitoring System
 * 
 * Re-exports domain-specific mock modules while maintaining backward compatibility
 * with existing components.
 */

import { MOCK_SENSORS, getPrimaryStation, getSensorById } from './mockSensors';
import {
  BASELINE_PRESSURE_HPA,
  BASELINE_TEMPERATURE_C,
  DOMINANT_FREQUENCY_HZ,
  NOISE_FLOOR_AMPLITUDE_PA,
  MOCK_FREQUENCY_SPECTRUM,
  generateLiveWaveformWindow,
  MOCK_PRESSURE_TRENDS,
  MOCK_RECENT_READINGS
} from './mockReadings';
import { MOCK_EVENTS } from './mockEvents';
import { MOCK_ALERTS } from './mockAlerts';
import { MOCK_USERS } from './mockUsers';

export {
  MOCK_SENSORS,
  getPrimaryStation,
  getSensorById,
  BASELINE_PRESSURE_HPA,
  BASELINE_TEMPERATURE_C,
  DOMINANT_FREQUENCY_HZ,
  NOISE_FLOOR_AMPLITUDE_PA,
  MOCK_FREQUENCY_SPECTRUM,
  generateLiveWaveformWindow,
  MOCK_PRESSURE_TRENDS,
  MOCK_RECENT_READINGS,
  MOCK_EVENTS,
  MOCK_ALERTS,
  MOCK_USERS
};

// Backwards-compatible aliases for existing components
export const CURRENT_STATION = {
  id: 'INS-001',
  code: 'INS-001',
  name: 'Station A',
  location: 'Bengaluru, India',
  coordinates: '12.9716° N, 77.5946° E',
  status: 'Online',
  lastUpdate: '2 sec ago',
  dataQuality: 'Good (99.8%)',
  sampleRate: '20 Hz',
  sensorModel: 'BMP388 Precision Array',
  uptime: '99.8%'
};

export const SENSOR_NETWORK = MOCK_SENSORS.map(s => ({
  id: s.sensorId,
  name: s.station,
  location: s.location,
  status: s.status === 'ONLINE' ? 'Online' : 'Offline',
  lastUpdate: s.lastUpdate,
  health: s.health,
  battery: `${s.battery}%`,
  sampleRate: s.sampleRate
}));

export const ADMIN_NETWORK_SUMMARY = {
  totalSensors: MOCK_SENSORS.length,
  onlineSensors: MOCK_SENSORS.filter(s => s.status === 'ONLINE').length,
  offlineSensors: MOCK_SENSORS.filter(s => s.status === 'OFFLINE').length,
  activeEvents: MOCK_EVENTS.filter(e => e.status !== 'FALSE_POSITIVE').length,
  activeAlerts: MOCK_ALERTS.filter(a => !a.resolved).length,
  registeredUsers: MOCK_USERS.length
};

export const USER_MEASUREMENTS = {
  pressure: {
    title: 'Pressure',
    value: '1012.4',
    unit: 'hPa',
    trend: '+0.2 hPa vs 1h avg',
    nominal: '1013.25 hPa'
  },
  temperature: {
    title: 'Temperature',
    value: '27.4',
    unit: '°C',
    trend: 'Stable ±0.1 °C',
    nominal: 'Core sensor 27.4 °C'
  },
  frequency: {
    title: 'Infrasound Frequency',
    value: '2.8',
    unit: 'Hz',
    trend: 'Dominant sub-audible peak',
    nominal: 'Band 0.1 – 20 Hz'
  },
  amplitude: {
    title: 'Amplitude',
    value: '0.07',
    unit: 'Pa',
    trend: 'Quiet background noise',
    nominal: 'Threshold: 0.35 Pa'
  }
};

export const generateWaveformPoints = generateLiveWaveformWindow;

export const CURRENT_STATUS = {
  state: 'NORMAL',
  label: 'Normal',
  message: 'No abnormal infrasound activity detected.',
  staLtaRatio: '1.18',
  threshold: '3.50',
  dataQuality: '99.8%'
};

export const SENSOR_STATUS_DATA = {
  stationId: 'INS-001',
  sensorType: 'BMP388 Precision Tri-Array',
  status: 'ONLINE',
  firmware: 'v2.4.1-rc3',
  battery: '98%',
  lastUpdate: '2 sec ago',
  quality: '99.8%'
};

export const RECENT_READINGS = MOCK_RECENT_READINGS;
export const RECENT_EVENTS = MOCK_EVENTS;
export const SYSTEM_ACTIVITIES = [
  {
    id: 'ACT-001',
    time: 'Just now',
    type: 'HEARTBEAT',
    message: 'Station A (INS-BLR-01) telemetry frame verified (20 Hz, 0 packet loss).',
    severity: 'NORMAL'
  },
  {
    id: 'ACT-002',
    time: '4 min ago',
    type: 'SECURITY',
    message: 'Operator user@infrasound.org established authenticated terminal session.',
    severity: 'INFO'
  },
  {
    id: 'ACT-003',
    time: '18 min ago',
    type: 'ALERT',
    message: 'Station D (INS-PUN-04) heartbeat missed. Network Operations Center alerted.',
    severity: 'WARNING'
  },
  {
    id: 'ACT-004',
    time: '1 hour ago',
    type: 'CALIBRATION',
    message: 'Automated diurnal pressure drift baseline calibrated against NOAA barometer standard.',
    severity: 'NORMAL'
  }
];
