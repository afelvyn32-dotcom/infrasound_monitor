import api from './api';

export const adminService = {
  getUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },

  updateUserRole: async (userId, role) => {
    const res = await api.put(`/users/${userId}/role`, { role });
    return res.data;
  },

  toggleUserStatus: async (userId) => {
    const res = await api.put(`/users/${userId}/status`);
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await api.delete(`/users/${userId}`);
    return res.data;
  },

  getSettings: async () => {
    const res = await api.get('/settings');
    return res.data;
  },

  updateSetting: async (key, value, description) => {
    const res = await api.put('/settings', { key, value, description });
    return res.data;
  },

  triggerSimulation: async (profile) => {
    const res = await api.post('/settings/trigger-simulation', { profile });
    return res.data;
  },

  toggleSimulator: async (enable) => {
    const res = await api.post('/settings/toggle-simulator', { enable });
    return res.data;
  }
};
