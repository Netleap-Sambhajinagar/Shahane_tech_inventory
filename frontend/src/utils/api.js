// API utility functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiUrl = (path = '') => {
  return `${API_BASE_URL}${path}`;
};

export const SOCKET_URL = API_BASE_URL;
