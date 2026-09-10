import api from './api';
import { MOCK_EVENTS } from '../data/mockEvents';

export const eventService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/events', { params });
      if (res.data?.success && res.data?.data?.length > 0) {
        return res.data;
      }
      return { success: true, data: MOCK_EVENTS };
    } catch (err) {
      console.warn('[eventService] Fallback to mockEvents:', err.message);
      let filtered = [...MOCK_EVENTS];
      if (params.classification) {
        filtered = filtered.filter(e => e.classification === params.classification);
      }
      if (params.severity) {
        filtered = filtered.filter(e => e.severity === params.severity);
      }
      return { success: true, data: filtered };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data?.success && res.data?.data) {
        return res.data;
      }
      throw new Error('Not found on server');
    } catch (err) {
      const found = MOCK_EVENTS.find(e => e.eventId === id) || MOCK_EVENTS[0];
      return { success: true, data: found };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/events/stats/summary');
      if (res.data?.success) return res.data;
      throw new Error('Fallback stats');
    } catch (err) {
      return {
        success: true,
        data: {
          totalEvents: MOCK_EVENTS.length,
          verified: MOCK_EVENTS.filter(e => e.status === 'VERIFIED').length,
          pending: MOCK_EVENTS.filter(e => e.status === 'PENDING_REVIEW').length,
          falsePositive: MOCK_EVENTS.filter(e => e.status === 'FALSE_POSITIVE').length
        }
      };
    }
  },

  updateStatus: async (id, statusData) => {
    try {
      const res = await api.put(`/events/${id}/status`, statusData);
      return res.data;
    } catch (err) {
      console.warn('[eventService] Local mock status update for:', id, statusData);
      const ev = MOCK_EVENTS.find(e => e.eventId === id);
      if (ev) {
        ev.status = statusData.status || ev.status;
        if (statusData.analystNotes) ev.analystNotes = statusData.analystNotes;
        return { success: true, data: ev };
      }
      return { success: true, data: statusData };
    }
  }
};
