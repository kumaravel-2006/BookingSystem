import axios from 'axios';
import { getToken, removeToken } from '../utils/jwtUtils';

export const authApi = axios.create({
  baseURL: 'https://cinepassapi.kumaravel.online',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const eventApi = axios.create({
  baseURL: 'https://cinepassapi.kumaravel.online',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to append JWT
const addAuthToken = (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addAuthToken);
eventApi.interceptors.request.use(addAuthToken);

// Response interceptor to handle 401
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    removeToken();
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use((res) => res, handleAuthError);
eventApi.interceptors.response.use((res) => res, handleAuthError);
