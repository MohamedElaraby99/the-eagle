import axios from 'axios';

// Determine base URL based on environment
const getBaseUrl = () => {
  // Check if we're in production
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://api.the-eagle.fikra.solutions/api/v1';
  }
  // Development fallback
  return import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:4002/api/v1';
};

const BASE_URL = getBaseUrl();

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})