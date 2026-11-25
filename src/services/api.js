import axios from 'axios';
import { Config } from '../constants/Config';
import { supabase } from './supabase';
import storage from '../utils/storage';

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: attach Supabase JWT or stored bearer token
api.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        const storedToken = await storage.getSecureItem(storage.KEYS.AUTH_TOKEN);
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      }
    } catch (e) {
      console.warn('API interceptor token lookup warning:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized or server errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('Unauthorized request to backend API');
    }
    return Promise.reject(error);
  }
);

export default api;
