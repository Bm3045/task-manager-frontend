import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://task-manager-backend-40f8.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple cache for GET requests
const cache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to avoid cache in development
    if (process.env.NODE_ENV === 'development' && config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get') {
      const cacheKey = response.config.url + JSON.stringify(response.config.params);
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Don't show toast for 401 errors (handled by auth)
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || 'Something went wrong';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

// Clear cache on logout
export const clearCache = () => {
  cache.clear();
};

export default api;
