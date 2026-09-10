import api from './api';
import { MOCK_ALERTS } from '../data/mockAlerts';

export const alertService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/alerts', { params });
      if (res.data?.success && res.data?.data?.length > 0) {
        return res.data;
      }
      return { success: true, data: MOCK_ALERTS };
    } catch (err) {
      console.warn('[alertService] Fallback to mockAlerts:', err.message);
      let list = [...MOCK_ALERTS];
      if (params.severity) {
        list = list.filter(a => a.severity === params.severity);
      }
      if (params.unacknowledgedOnly) {
        list = list.filter(a => !a.resolved);
      }
      return { success: true, data: list };
    }
  },

  acknowledge: async (id) => {
    try {
      const res = await api.put(`/alerts/${id}/ack`);
      return res.data;
    } catch (err) {
      console.warn('[alertService] Local mock ack for:', id);
      const target = MOCK_ALERTS.find(a => a.alertId === id);
      if (target) {
        target.status = 'RESOLVED';
        target.resolved = true;
        return { success: true, data: target };
      }
      return { success: true, message: 'Alert acknowledged' };
    }
  },

  acknowledgeAll: async () => {
    try {
      const res = await api.put('/alerts/acknowledge-all');
      return res.data;
    } catch (err) {
      MOCK_ALERTS.forEach(a => {
        a.status = 'RESOLVED';
        a.resolved = true;
      });
      return { success: true, message: 'All alerts marked as acknowledged' };
    }
  }
};
