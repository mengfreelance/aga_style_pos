import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('stylepos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('stylepos_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default {
  get(path) {
    return api.get(path);
  },
  post(path, body) {
    return api.post(path, body);
  },
  put(path, body) {
    return api.put(path, body);
  },
  delete(path) {
    return api.delete(path);
  },
};
