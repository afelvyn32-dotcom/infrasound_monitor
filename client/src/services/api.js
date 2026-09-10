import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('infrasound_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor to handle session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired and not on login page, clear token
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('infrasound_token');
        localStorage.removeItem('infrasound_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
