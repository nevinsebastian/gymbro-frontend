import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://172.20.10.2:5000', // Use computer's IP for mobile development
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Token expired or invalid
      AsyncStorage.removeItem('userToken');
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
