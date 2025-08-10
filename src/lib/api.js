// API utility to ensure correct URL usage
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Helper functions for common API calls
export const api = {
  login: (data) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  signup: (data) => apiCall('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};