import api, { clearCache } from './api';

let abortController = null;

const authService = {
  // Register user
  register: async (userData) => {
    // Cancel previous request if any
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    
    try {
      const response = await api.post('/auth/register', userData, {
        signal: abortController.signal
      });
      return response.data;
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.log('Request cancelled');
        return null;
      }
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();
    
    try {
      const response = await api.post('/auth/login', credentials, {
        signal: abortController.signal
      });
      return response.data;
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.log('Request cancelled');
        return null;
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      clearCache(); // Clear all cached data
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get current user - with deduplication
  getCurrentUser: async () => {
    // Use a unique key for this request to prevent duplicates
    const requestKey = 'getCurrentUser';
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // Don't throw error for 401 (not authenticated)
      if (error.response?.status === 401) {
        return { success: false };
      }
      throw error;
    }
  },
};

export default authService;