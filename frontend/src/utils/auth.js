// Authentication helper functions for admin API calls

export const getAuthHeaders = () => {
  const adminToken = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
  };
  return headers;
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    headers,
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
