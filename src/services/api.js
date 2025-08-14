import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.medogram.ir';
const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://127.0.0.1:8000';

// Create axios instances
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const localApiClient = axios.create({
  baseURL: LOCAL_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Response interceptor for error handling
const addResponseInterceptor = (client) => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors
addAuthInterceptor(apiClient);
addAuthInterceptor(localApiClient);
addResponseInterceptor(apiClient);
addResponseInterceptor(localApiClient);

// API Services
export const authAPI = {
  // Register user with phone number
  register: (phoneNumber) => {
    return apiClient.post('/api/register/', {
      phone_number: phoneNumber,
    });
  },

  // Verify user with code
  verify: (phoneNumber, code) => {
    return apiClient.post('/api/verify/', {
      phone_number: phoneNumber,
      code: code,
    });
  },

  // Get user profile
  getProfile: () => {
    return apiClient.get('/api/profile/');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return apiClient.put('/api/profile/', profileData);
  },
};

export const chatAPI = {
  // Send message to regular chat
  sendMessage: (message, token) => {
    return localApiClient.post('/api/chat/message/', 
      { message },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },

  // Send message to custom chat
  sendCustomMessage: (message, settings, token) => {
    return localApiClient.post('/api/customchatbot/message/', 
      { message, ...settings },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },

  // Save chat settings
  saveSettings: (settings, token) => {
    return localApiClient.post('/api/customchatbot/settings/', 
      settings,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  },

  // Get chat history
  getHistory: (token) => {
    return localApiClient.get('/api/chat/history/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

export const visitAPI = {
  // Get user visits
  getUserVisits: () => {
    return apiClient.get('/api/visits/');
  },

  // Create new visit
  createVisit: (visitData) => {
    return apiClient.post('/api/visits/', visitData);
  },

  // Get visit details
  getVisit: (visitId) => {
    return apiClient.get(`/api/visits/${visitId}/`);
  },
};

export const paymentAPI = {
  // Create payment
  createPayment: (paymentData) => {
    return apiClient.post('/api/payments/', paymentData);
  },

  // Verify payment
  verifyPayment: (paymentId, verificationData) => {
    return apiClient.post(`/api/payments/${paymentId}/verify/`, verificationData);
  },
};

export const predictionAPI = {
  // Diabetes prediction
  predictDiabetes: (healthData) => {
    return localApiClient.post('/api/predictions/diabetes/', healthData);
  },
};

// Export clients for custom usage
export { apiClient, localApiClient };