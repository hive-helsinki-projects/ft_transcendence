import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface ErrorResponse {
  message?: string;
  [key: string]: string | number | boolean | null | undefined;
}

const api = axios.create({
  baseURL: 'https://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    console.log("token = ", token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network Error: Please check your internet connection'));
    }

    // Handle specific error status codes
    const errorMessage = error.response.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api