// Authentication helper functions for admin API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
  };
  console.log('Auth headers being sent:', headers);
  return headers;
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  // Convert relative URLs to absolute URLs
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(fullUrl, {
    headers,
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
