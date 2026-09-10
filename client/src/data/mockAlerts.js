/**
 * Mock System & Acoustic Alerts Dataset
 */

export const MOCK_ALERTS = [
  {
    alertId: 'ALT-1092',
    eventId: 'EVT-2026-0838',
    station: 'Station C',
    sensorId: 'INS-DEL-03',
    alertType: 'ACOUSTIC_OVERPRESSURE',
    title: 'Critical Shockwave Pulse Detected',
    message: 'Instantaneous acoustic energy exceeded calibrated safety envelope (Peak 0.85 Pa vs 0.35 Pa nominal).',
    time: '2026-09-09 23:05:14',
    frequency: '4.5 Hz',
    amplitude: '0.85 Pa',
    severity: 'CRITICAL',
    status: 'UNACKNOWLEDGED',
    resolved: false,
    operator: null
  },
  {
    alertId: 'ALT-1091',
    eventId: 'EVT-2026-0840',
    station: 'Station B',
    sensorId: 'INS-HYD-02',
    alertType: 'SEISMIC_AIRWAVE_TRIGGER',
    title: 'High Amplitude Low-Frequency Signal',
    message: 'Automated STA/LTA energy detector triggered with ratio 6.94 exceeding 3.50 threshold limit.',
    time: '2026-09-10 09:14:22',
    frequency: '1.4 Hz',
    amplitude: '0.68 Pa',
    severity: 'HIGH',
    status: 'UNACKNOWLEDGED',
    resolved: false,
    operator: null
  },
  {
    alertId: 'ALT-1090',
    eventId: null,
    station: 'Station D',
    sensorId: 'INS-PUN-04',
    alertType: 'NODE_OFFLINE',
    title: 'Station Telemetry Link Lost',
    message: 'Heartbeat signal lost for > 20 minutes. Battery voltage reported critical (14%) prior to disconnect.',
    time: '2026-09-10 14:27:00',
    frequency: 'N/A',
    amplitude: 'N/A',
    severity: 'MEDIUM',
    status: 'INVESTIGATING',
    resolved: false,
    operator: 'Admin Operations'
  },
  {
    alertId: 'ALT-1089',
    eventId: 'EVT-2026-0841',
    station: 'Station A',
    sensorId: 'INS-BLR-01',
    alertType: 'CONVECTIVE_VORTEX',
    title: 'Weather Infrasound Wavefront',
    message: 'Low frequency oscillation detected during severe atmospheric pressure variation.',
    time: '2026-09-10 11:32:08',
    frequency: '2.8 Hz',
    amplitude: '0.42 Pa',
    severity: 'MEDIUM',
    status: 'RESOLVED',
    resolved: true,
    operator: 'Senior Analyst'
  },
  {
    alertId: 'ALT-1088',
    eventId: 'EVT-2026-0839',
    station: 'Station A',
    sensorId: 'INS-BLR-01',
    alertType: 'MICROBAROM_ENVELOPE',
    title: 'Marine Microbarom Transient',
    message: 'Continuous sinusoidal train detected across 2.5–3.5 Hz band.',
    time: '2026-09-10 06:48:10',
    frequency: '3.1 Hz',
    amplitude: '0.29 Pa',
    severity: 'LOW',
    status: 'RESOLVED',
    resolved: true,
    operator: 'System Automator'
  }
];
