/**
 * Mock Readings & Telemetry Dataset
 * Provides simulated high-density 20 Hz acoustic micro-pressure,
 * barometric pressure variations, and frequency spectral distribution.
 */

export const BASELINE_PRESSURE_HPA = 1012.4;
export const BASELINE_TEMPERATURE_C = 27.4;
export const DOMINANT_FREQUENCY_HZ = 2.8;
export const NOISE_FLOOR_AMPLITUDE_PA = 0.07;

/**
 * 20-band sub-audible frequency spectrum distribution (0.1 to 20.0 Hz)
 */
export const MOCK_FREQUENCY_SPECTRUM = [
  { freq: '0.1 Hz', psd: 0.08, isDominant: false },
  { freq: '0.5 Hz', psd: 0.14, isDominant: false },
  { freq: '1.0 Hz', psd: 0.22, isDominant: false },
  { freq: '1.5 Hz', psd: 0.35, isDominant: false },
  { freq: '2.0 Hz', psd: 0.54, isDominant: false },
  { freq: '2.4 Hz', psd: 0.76, isDominant: false },
  { freq: '2.8 Hz', psd: 0.94, isDominant: true }, // Highlighted dominant peak
  { freq: '3.2 Hz', psd: 0.62, isDominant: false },
  { freq: '4.0 Hz', psd: 0.41, isDominant: false },
  { freq: '5.0 Hz', psd: 0.28, isDominant: false },
  { freq: '6.5 Hz', psd: 0.19, isDominant: false },
  { freq: '8.0 Hz', psd: 0.15, isDominant: false },
  { freq: '10.0 Hz', psd: 0.12, isDominant: false },
  { freq: '12.0 Hz', psd: 0.09, isDominant: false },
  { freq: '14.0 Hz', psd: 0.08, isDominant: false },
  { freq: '15.5 Hz', psd: 0.06, isDominant: false },
  { freq: '17.0 Hz', psd: 0.05, isDominant: false },
  { freq: '18.5 Hz', psd: 0.04, isDominant: false },
  { freq: '19.2 Hz', psd: 0.03, isDominant: false },
  { freq: '20.0 Hz', psd: 0.02, isDominant: false }
];

/**
 * Generates initial rolling waveform points for the live chart
 */
export const generateLiveWaveformWindow = (seconds = 30) => {
  const points = [];
  const now = Date.now();
  const stepMs = 1000; // 1 second display buckets for chart stability

  for (let i = seconds; i >= 0; i--) {
    const t = (now - i * stepMs) / 1000;
    const timeLabel = new Date(now - i * stepMs).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // Infrasound acoustic micro-pressure formula
    const carrier = Math.sin(t * 1.6) * 0.06;
    const harmonic = Math.cos(t * 0.8) * 0.025;
    const microbarom = Math.sin(t * 2.8 * Math.PI) * 0.015;
    const jitter = (Math.random() - 0.5) * 0.01;
    const amplitude = Number((carrier + harmonic + microbarom + jitter).toFixed(3));

    points.push({
      time: timeLabel,
      timestamp: now - i * stepMs,
      amplitude,
      upperThreshold: 0.35,
      lowerThreshold: -0.35
    });
  }
  return points;
};

/**
 * Historical barometric pressure variation dataset (hPa over 24h)
 */
export const MOCK_PRESSURE_TRENDS = [
  { time: '00:00', pressure: 1011.8, temp: 24.8, status: 'NORMAL' },
  { time: '02:00', pressure: 1011.9, temp: 24.5, status: 'NORMAL' },
  { time: '04:00', pressure: 1012.1, temp: 24.2, status: 'NORMAL' },
  { time: '06:00', pressure: 1012.3, temp: 24.9, status: 'NORMAL' },
  { time: '08:00', pressure: 1012.6, temp: 25.8, status: 'NORMAL' },
  { time: '10:00', pressure: 1012.8, temp: 26.7, status: 'NORMAL' },
  { time: '12:00', pressure: 1012.4, temp: 27.5, status: 'NORMAL' },
  { time: '14:00', pressure: 1012.1, temp: 27.8, status: 'NORMAL' },
  { time: '16:00', pressure: 1011.9, temp: 27.2, status: 'NORMAL' },
  { time: '18:00', pressure: 1012.2, temp: 26.4, status: 'NORMAL' },
  { time: '20:00', pressure: 1012.5, temp: 25.6, status: 'NORMAL' },
  { time: '22:00', pressure: 1012.4, temp: 25.1, status: 'NORMAL' }
];

/**
 * Recent tabular sensor readings
 */
export const MOCK_RECENT_READINGS = [
  {
    id: 'RD-9021',
    time: '14:52:18',
    pressure: '1012.4 hPa',
    temp: '27.4 °C',
    frequency: '2.8 Hz',
    amplitude: '0.07 Pa',
    status: 'NORMAL'
  },
  {
    id: 'RD-9020',
    time: '14:52:17',
    pressure: '1012.4 hPa',
    temp: '27.4 °C',
    frequency: '2.8 Hz',
    amplitude: '0.06 Pa',
    status: 'NORMAL'
  },
  {
    id: 'RD-9019',
    time: '14:52:16',
    pressure: '1012.3 hPa',
    temp: '27.3 °C',
    frequency: '2.9 Hz',
    amplitude: '0.08 Pa',
    status: 'NORMAL'
  },
  {
    id: 'RD-9018',
    time: '14:52:15',
    pressure: '1012.4 hPa',
    temp: '27.4 °C',
    frequency: '2.8 Hz',
    amplitude: '0.07 Pa',
    status: 'NORMAL'
  },
  {
    id: 'RD-9017',
    time: '14:52:14',
    pressure: '1012.5 hPa',
    temp: '27.4 °C',
    frequency: '2.7 Hz',
    amplitude: '0.07 Pa',
    status: 'NORMAL'
  },
  {
    id: 'RD-9016',
    time: '14:52:13',
    pressure: '1012.4 hPa',
    temp: '27.4 °C',
    frequency: '2.8 Hz',
    amplitude: '0.06 Pa',
    status: 'NORMAL'
  }
];
