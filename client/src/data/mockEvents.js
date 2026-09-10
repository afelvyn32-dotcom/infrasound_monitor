/**
 * Mock Infrasound Events Dataset
 * Automated STA/LTA acoustic anomaly detections
 */

export const MOCK_EVENTS = [
  {
    eventId: 'EVT-2026-0841',
    station: 'Station A',
    stationCode: 'BLR-01',
    sensorId: 'INS-BLR-01',
    sensorName: 'Station A · Main Observatory',
    startTime: '2026-09-10 11:32:08',
    endTime: '2026-09-10 11:32:44',
    duration: '36 sec',
    dominantFrequency: 2.8,
    peakAmplitude: 0.42,
    staLtaRatio: 5.82,
    thresholdRatio: 3.5,
    severity: 'MEDIUM',
    classification: 'ATMOSPHERIC_VORTEX',
    status: 'VERIFIED',
    analystNotes: 'Strong low-frequency convective gust front oscillation confirmed by regional Doppler radar.',
    waveformSnapshot: [
      { time: '0s', amplitude: 0.05 },
      { time: '4s', amplitude: 0.08 },
      { time: '8s', amplitude: 0.14 },
      { time: '12s', amplitude: 0.28 },
      { time: '16s', amplitude: 0.42 }, // Peak
      { time: '20s', amplitude: 0.38 },
      { time: '24s', amplitude: 0.26 },
      { time: '28s', amplitude: 0.18 },
      { time: '32s', amplitude: 0.11 },
      { time: '36s', amplitude: 0.06 }
    ],
    spectralSnapshot: [
      { freq: '1.0 Hz', val: 0.2 },
      { freq: '2.0 Hz', val: 0.6 },
      { freq: '2.8 Hz', val: 0.98 },
      { freq: '4.0 Hz', val: 0.4 },
      { freq: '6.0 Hz', val: 0.1 }
    ]
  },
  {
    eventId: 'EVT-2026-0840',
    station: 'Station B',
    stationCode: 'HYD-02',
    sensorId: 'INS-HYD-02',
    sensorName: 'Station B · Deccan Array',
    startTime: '2026-09-10 09:14:22',
    endTime: '2026-09-10 09:15:18',
    duration: '56 sec',
    dominantFrequency: 1.4,
    peakAmplitude: 0.68,
    staLtaRatio: 6.94,
    thresholdRatio: 3.5,
    severity: 'HIGH',
    classification: 'SEISMIC_ACOUSTIC',
    status: 'VERIFIED',
    analystNotes: 'Rayleigh surface wave infrasound coupling matching regional seismic observatory timestamp.',
    waveformSnapshot: [
      { time: '0s', amplitude: 0.08 },
      { time: '6s', amplitude: 0.22 },
      { time: '14s', amplitude: 0.45 },
      { time: '22s', amplitude: 0.68 }, // Peak
      { time: '30s', amplitude: 0.52 },
      { time: '38s', amplitude: 0.34 },
      { time: '46s', amplitude: 0.19 },
      { time: '56s', amplitude: 0.07 }
    ],
    spectralSnapshot: [
      { freq: '0.5 Hz', val: 0.4 },
      { freq: '1.4 Hz', val: 0.95 },
      { freq: '2.5 Hz', val: 0.5 },
      { freq: '4.0 Hz', val: 0.2 }
    ]
  },
  {
    eventId: 'EVT-2026-0839',
    station: 'Station A',
    stationCode: 'BLR-01',
    sensorId: 'INS-BLR-01',
    sensorName: 'Station A · Main Observatory',
    startTime: '2026-09-10 06:48:10',
    endTime: '2026-09-10 06:48:32',
    duration: '22 sec',
    dominantFrequency: 3.1,
    peakAmplitude: 0.29,
    staLtaRatio: 4.12,
    thresholdRatio: 3.5,
    severity: 'LOW',
    classification: 'MICROBAROM',
    status: 'VERIFIED',
    analystNotes: 'Marine microbarom marine wave interaction packet from Arabian Sea depression.',
    waveformSnapshot: [
      { time: '0s', amplitude: 0.04 },
      { time: '4s', amplitude: 0.12 },
      { time: '10s', amplitude: 0.29 },
      { time: '16s', amplitude: 0.18 },
      { time: '22s', amplitude: 0.05 }
    ],
    spectralSnapshot: [
      { freq: '1.5 Hz', val: 0.3 },
      { freq: '3.1 Hz', val: 0.88 },
      { freq: '5.0 Hz', val: 0.2 }
    ]
  },
  {
    eventId: 'EVT-2026-0838',
    station: 'Station C',
    stationCode: 'DEL-03',
    sensorId: 'INS-DEL-03',
    sensorName: 'Station C · Northern Plains',
    startTime: '2026-09-09 23:05:14',
    endTime: '2026-09-09 23:05:40',
    duration: '26 sec',
    dominantFrequency: 4.5,
    peakAmplitude: 0.85,
    staLtaRatio: 8.42,
    thresholdRatio: 3.5,
    severity: 'CRITICAL',
    classification: 'SUPERSONIC_SHOCKWAVE',
    status: 'PENDING_REVIEW',
    analystNotes: 'High-amplitude N-wave signature characteristic of high-altitude aerospace transition.',
    waveformSnapshot: [
      { time: '0s', amplitude: 0.02 },
      { time: '5s', amplitude: 0.40 },
      { time: '10s', amplitude: 0.85 }, // Shock spike
      { time: '15s', amplitude: -0.65 },
      { time: '20s', amplitude: 0.18 },
      { time: '26s', amplitude: 0.04 }
    ],
    spectralSnapshot: [
      { freq: '2.0 Hz', val: 0.45 },
      { freq: '4.5 Hz', val: 0.99 },
      { freq: '8.0 Hz', val: 0.65 },
      { freq: '12.0 Hz', val: 0.3 }
    ]
  },
  {
    eventId: 'EVT-2026-0837',
    station: 'Station E',
    stationCode: 'MUM-05',
    sensorId: 'INS-MUM-05',
    sensorName: 'Station E · Coastal Post',
    startTime: '2026-09-09 18:22:04',
    endTime: '2026-09-09 18:22:19',
    duration: '15 sec',
    dominantFrequency: 6.2,
    peakAmplitude: 0.22,
    staLtaRatio: 3.75,
    thresholdRatio: 3.5,
    severity: 'LOW',
    classification: 'INDUSTRIAL_NOISE',
    status: 'FALSE_POSITIVE',
    analystNotes: 'Port facility heavy diesel generator startup transient.',
    waveformSnapshot: [
      { time: '0s', amplitude: 0.05 },
      { time: '4s', amplitude: 0.15 },
      { time: '8s', amplitude: 0.22 },
      { time: '12s', amplitude: 0.11 },
      { time: '15s', amplitude: 0.04 }
    ],
    spectralSnapshot: [
      { freq: '3.0 Hz', val: 0.2 },
      { freq: '6.2 Hz', val: 0.72 },
      { freq: '10.0 Hz', val: 0.35 }
    ]
  }
];
