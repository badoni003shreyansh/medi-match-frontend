import axios from 'axios';

// Base URL for local backend
const BASE_URL = process.env.REACT_APP_FLASK_BACKEND_URL || 'http://127.0.0.1:5000';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000, // 2 minutes timeout for slow Hugging Face backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 503) {
      console.error('Backend service is starting up, please wait...');
    } else if (error.response?.status === 413) {
      console.error('File too large');
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const medicalAPI = {
  // Process medical image for diagnosis
  processImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/process_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

export const clinicalAPI = {
  // Fetch clinical trials based on user profile
  fetchClinicalTrials: async (userProfile) => {
    const response = await api.post('/search_clinical_trials', userProfile);
    return response.data;
  },
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default api; 