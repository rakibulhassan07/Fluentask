import axios from 'axios';

// Environment-based API URL configuration
const getApiUrl = () => {
  // Check if we're in production (deployed)
  if (import.meta.env.PROD) {
    // Production backend URL (update this with your actual Render backend URL)
    return import.meta.env.VITE_API_URL || 'https://fluentask-backend.onrender.com';
  }
  // Development backend URL
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

const axiosPublic = axios.create({
    baseURL: getApiUrl(),
    withCredentials: false, // Set to true if you need cookies/auth
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor for debugging
axiosPublic.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosPublic.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;