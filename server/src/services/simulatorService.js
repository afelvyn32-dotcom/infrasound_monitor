import Sensor from '../models/Sensor.js';
import { processTelemetryPayload } from '../controllers/telemetryController.js';

let simulationInterval = null;
let simulationState = {
  activeProfile: 'NORMAL', // 'NORMAL', 'EXPLOSION', 'SEISMIC', 'SEVERE_WEATHER'
  profileRemainingTicks: 0,
  step: 0
};

export const setSimulationProfile = (profile) => {
  simulationState.activeProfile = profile;
  if (profile === 'EXPLOSION') {
    simulationState.profileRemainingTicks = 8; // ~4 seconds
  } else if (profile === 'SEISMIC') {
    simulationState.profileRemainingTicks = 30; // ~15 seconds
  } else if (profile === 'SEVERE_WEATHER') {
    simulationState.profileRemainingTicks = 40; // ~20 seconds
  } else {
    simulationState.profileRemainingTicks = 0;
  }
  console.log(`[Simulator] Active profile switched to: ${profile} (Ticks remaining: ${simulationState.profileRemainingTicks})`);
  return simulationState;
};

export const getSimulationStatus = () => {
  return {
    isRunning: simulationInterval !== null,
    ...simulationState
  };
};

/**
 * Generate 10 synthetic samples (500ms chunk at 20 Hz = 50ms per sample)
 */
const generateSamplesForSensor = (sensorId, offsetMsBase) => {
  const samples = [];
  const count = 10;
  const dt = 50; // 50ms

  for (let i = 0; i < count; i++) {
    simulationState.step++;
    const t = simulationState.step * 0.05; // Time in seconds
    let deltaP = 0.0;
    const baseNoise = (Math.random() - 0.5) * 0.3; // ±0.15 Pa ambient microbarom noise

    if (simulationState.activeProfile === 'EXPLOSION' && simulationState.profileRemainingTicks > 0) {
      // High-pressure shockwave pulse: sudden spike with exponential decay
      const decay = Math.exp(-0.25 * (8 - simulationState.profileRemainingTicks));
      deltaP = (16.5 * decay * Math.sin(2 * Math.PI * 4.5 * t)) + baseNoise;
    } else if (simulationState.activeProfile === 'SEISMIC' && simulationState.profileRemainingTicks > 0) {
      // Seismic ground motion coupling: 1.2 Hz oscillation
      deltaP = (5.5 * Math.sin(2 * Math.PI * 1.2 * t)) + (Math.sin(2 * Math.PI * 2.4 * t) * 1.5) + baseNoise;
    } else if (simulationState.activeProfile === 'SEVERE_WEATHER' && simulationState.profileRemainingTicks > 0) {
      // Atmospheric vortex / severe storm front: 0.3 Hz slow acoustic wave
      deltaP = (7.8 * Math.sin(2 * Math.PI * 0.35 * t)) + baseNoise;
    } else {
      // Normal calm ambient atmosphere: 0.1 Hz microbaroms + noise
      deltaP = (0.25 * Math.sin(2 * Math.PI * 0.1 * t)) + baseNoise;
    }

    const rawP = 101325 + deltaP;

    samples.push({
      offsetMs: i * dt,
      pressurePa: Number(deltaP.toFixed(3)),
      rawPressure: Number((rawP / 100).toFixed(2)) // Convert Pa to hPa for raw representation
    });
  }

  // Decrement remaining ticks if a transient anomaly is running
  if (simulationState.profileRemainingTicks > 0) {
    simulationState.profileRemainingTicks--;
    if (simulationState.profileRemainingTicks === 0) {
      simulationState.activeProfile = 'NORMAL';
      console.log('[Simulator] Anomaly finished, returned to NORMAL ambient baseline.');
    }
  }

  return samples;
};

export const startSimulator = async () => {
  if (simulationInterval) return;

  console.log('[Simulator] Starting virtual infrasound telemetry generator...');

  // Ensure simulated sensors exist in DB
  const defaultSensors = [
    {
      sensorId: 'ESP32-INFRA-01',
      name: 'Ridge Observatory Station (ESP32-01)',
      location: { name: 'North Ridge Crest', latitude: 37.7749, longitude: -122.4194, elevationMeters: 450 },
      status: 'SIMULATED',
      apiKey: 'sec_sensor_key_ridge_01',
      samplingRateHz: 20
    },
    {
      sensorId: 'ESP32-INFRA-02',
      name: 'Valley Acoustic Lab (ESP32-02)',
      location: { name: 'South Valley Basin', latitude: 37.7600, longitude: -122.4400, elevationMeters: 65 },
      status: 'SIMULATED',
      apiKey: 'sec_sensor_key_valley_02',
      samplingRateHz: 20
    }
  ];

  for (const s of defaultSensors) {
    const exists = await Sensor.findOne({ sensorId: s.sensorId });
    if (!exists) {
      await Sensor.create(s);
      console.log(`[Simulator] Registered virtual sensor: ${s.sensorId}`);
    }
  }

  simulationInterval = setInterval(async () => {
    try {
      const now = Date.now();
      for (const s of defaultSensors) {
        const samples = generateSamplesForSensor(s.sensorId, now);
        // Dispatch into the exact same processing pipeline that real ESP32 uses
        await processTelemetryPayload({
          sensorId: s.sensorId,
          apiKey: s.apiKey,
          timestamp: now,
          samples,
          battery: 98,
          rssi: -58
        });
      }
    } catch (err) {
      console.error('[Simulator] Loop error:', err.message);
    }
  }, 500); // 500ms packet interval
};

export const stopSimulator = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    console.log('[Simulator] Infrasound simulator stopped.');
  }
};
