import api from './api';
import { MOCK_SENSORS, getSensorById } from '../data/mockSensors';

export const sensorService = {
  getAll: async () => {
    try {
      const res = await api.get('/sensors');
      if (res.data?.success && res.data?.data?.length > 0) {
        return res.data;
      }
      return { success: true, data: MOCK_SENSORS };
    } catch (err) {
      console.warn('[sensorService] API offline or error, using mockSensors fallback:', err.message);
      return { success: true, data: MOCK_SENSORS };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/sensors/${id}`);
      if (res.data?.success && res.data?.data) {
        return res.data;
      }
      return { success: true, data: getSensorById(id) };
    } catch (err) {
      console.warn(`[sensorService] API offline, returning mock fallback for ${id}`);
      return { success: true, data: getSensorById(id) };
    }
  },

  create: async (sensorData) => {
    try {
      const res = await api.post('/sensors', sensorData);
      return res.data;
    } catch (err) {
      console.warn('[sensorService] Local mock creation:', sensorData);
      const newSensor = {
        ...sensorData,
        sensorId: sensorData.sensorId || `INS-GEN-${Math.floor(Math.random() * 90 + 10)}`,
        status: 'ONLINE',
        health: 'Good (100%)',
        dataQuality: 99.9,
        lastUpdate: 'Just now'
      };
      MOCK_SENSORS.unshift(newSensor);
      return { success: true, data: newSensor };
    }
  },

  update: async (id, updateData) => {
    try {
      const res = await api.put(`/sensors/${id}`, updateData);
      return res.data;
    } catch (err) {
      console.warn('[sensorService] Local mock update for:', id);
      const idx = MOCK_SENSORS.findIndex(s => s.sensorId === id);
      if (idx !== -1) {
        MOCK_SENSORS[idx] = { ...MOCK_SENSORS[idx], ...updateData };
        return { success: true, data: MOCK_SENSORS[idx] };
      }
      return { success: true, data: updateData };
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/sensors/${id}`);
      return res.data;
    } catch (err) {
      console.warn('[sensorService] Local mock delete for:', id);
      const idx = MOCK_SENSORS.findIndex(s => s.sensorId === id);
      if (idx !== -1) {
        MOCK_SENSORS.splice(idx, 1);
      }
      return { success: true, message: `Sensor ${id} deactivated` };
    }
  },

  getReadings: async (sensorId, limit = 100, from, to) => {
    try {
      let url = `/telemetry/readings/${sensorId}?limit=${limit}`;
      if (from) url += `&from=${from}`;
      if (to) url += `&to=${to}`;
      const res = await api.get(url);
      if (res.data?.success && res.data?.data?.length > 0) {
        return res.data;
      }
      throw new Error('No remote readings, fallback to mock');
    } catch (err) {
      // Return generated simulated time-series
      const mockReadings = [];
      const now = Date.now();
      for (let i = limit; i >= 0; i--) {
        const time = new Date(now - i * 60000);
        const t = (now - i * 60000) / 1000;
        const p = 1012.4 + Math.sin(t * 0.05) * 0.4 + (Math.random() - 0.5) * 0.05;
        mockReadings.push({
          timestamp: time.toISOString(),
          stats: {
            maxPressure: Number((p + 0.1).toFixed(2)),
            minPressure: Number((p - 0.1).toFixed(2)),
            avgPressure: Number(p.toFixed(2))
          },
          sampleCount: 1200
        });
      }
      return { success: true, data: mockReadings };
    }
  }
};
