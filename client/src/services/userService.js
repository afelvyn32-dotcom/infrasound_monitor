/**
 * User Management Service
 * Dual-mode API with mockUsers fallback
 */

import api from './api';
import { MOCK_USERS } from '../data/mockUsers';

export const userService = {
  getAll: async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data?.success && res.data?.data?.length > 0) {
        return res.data;
      }
      return { success: true, data: MOCK_USERS };
    } catch (err) {
      console.warn('[userService] API offline, using mockUsers fallback:', err.message);
      return { success: true, data: MOCK_USERS };
    }
  },

  create: async (userData) => {
    try {
      const res = await api.post('/admin/users', userData);
      return res.data;
    } catch (err) {
      const newUser = {
        userId: `USR-00${MOCK_USERS.length + 1}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'USER',
        title: userData.title || 'Observatory Staff',
        status: 'ACTIVE',
        assignedStation: userData.assignedStation || 'Station A · Bengaluru',
        lastLogin: 'Never',
        createdDate: new Date().toISOString().split('T')[0],
        isSuperAdmin: false
      };
      MOCK_USERS.unshift(newUser);
      return { success: true, data: newUser };
    }
  },

  update: async (userId, updateData) => {
    try {
      const res = await api.put(`/admin/users/${userId}`, updateData);
      return res.data;
    } catch (err) {
      const user = MOCK_USERS.find(u => u.userId === userId);
      if (user) {
        // Prevent removing admin access from super admin
        if (user.isSuperAdmin && updateData.role === 'USER') {
          return { success: false, message: 'Cannot demote the primary system administrator.' };
        }
        Object.assign(user, updateData);
        return { success: true, data: user };
      }
      return { success: false, message: 'User not found' };
    }
  },

  toggleStatus: async (userId) => {
    const user = MOCK_USERS.find(u => u.userId === userId);
    if (!user) return { success: false, message: 'User not found' };
    if (user.isSuperAdmin) {
      return { success: false, message: 'Cannot deactivate the primary system administrator.' };
    }
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return { success: true, data: user, message: `User status changed to ${user.status}` };
  },

  delete: async (userId) => {
    const user = MOCK_USERS.find(u => u.userId === userId);
    if (!user) return { success: false, message: 'User not found' };
    if (user.isSuperAdmin) {
      return { success: false, message: 'Cannot delete primary system administrator.' };
    }
    const idx = MOCK_USERS.findIndex(u => u.userId === userId);
    if (idx !== -1) MOCK_USERS.splice(idx, 1);
    return { success: true, message: 'User deleted successfully' };
  }
};
