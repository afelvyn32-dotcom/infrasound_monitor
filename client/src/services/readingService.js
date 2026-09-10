/**
 * Reading Service
 * Dual-mode telemetry and sensor stream service
 */

import api from './api';
import {
  generateLiveWaveformWindow,
  MOCK_PRESSURE_TRENDS,
  MOCK_FREQUENCY_SPECTRUM,
  MOCK_RECENT_READINGS,
  BASELINE_PRESSURE_HPA,
  BASELINE_TEMPERATURE_C,
  DOMINANT_FREQUENCY_HZ,
  NOISE_FLOOR_AMPLITUDE_PA
} from '../data/mockReadings';

export const readingService = {
  getLiveWaveform: (seconds = 30) => {
    return generateLiveWaveformWindow(seconds);
  },

  getPressureTrends: async () => {
    return { success: true, data: MOCK_PRESSURE_TRENDS };
  },

  getFrequencySpectrum: async () => {
    return { success: true, data: MOCK_FREQUENCY_SPECTRUM };
  },

  getRecentReadings: async () => {
    return { success: true, data: MOCK_RECENT_READINGS };
  },

  getCurrentMetrics: () => {
    return {
      pressure: {
        title: 'Pressure',
        value: BASELINE_PRESSURE_HPA.toFixed(1),
        unit: 'hPa',
        trend: '+0.2 hPa vs 1h avg',
        nominal: '1013.25 hPa'
      },
      temperature: {
        title: 'Temperature',
        value: BASELINE_TEMPERATURE_C.toFixed(1),
        unit: '°C',
        trend: 'Stable ±0.1 °C',
        nominal: 'Core sensor 27.4 °C'
      },
      frequency: {
        title: 'Infrasound Frequency',
        value: DOMINANT_FREQUENCY_HZ.toFixed(1),
        unit: 'Hz',
        trend: 'Dominant sub-audible peak',
        nominal: 'Band 0.1 – 20 Hz'
      },
      amplitude: {
        title: 'Amplitude',
        value: NOISE_FLOOR_AMPLITUDE_PA.toFixed(2),
        unit: 'Pa',
        trend: 'Quiet background noise',
        nominal: 'Threshold: 0.35 Pa'
      }
    };
  }
};
