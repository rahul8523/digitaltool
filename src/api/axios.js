// axiosInstance.js
import axios from 'axios';

const token = localStorage.getItem('authToken');

const axiosInstance = axios.create({
  baseURL: 'https://digitalxplode.in/admin/api',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// Interceptor to attach token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const newToken = localStorage.getItem('authToken');
    if (newToken) {
      config.headers['Authorization'] = `Bearer ${newToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
