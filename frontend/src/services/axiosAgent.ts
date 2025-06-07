import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { TokenService } from './tokenService';

interface ErrorResponse {
  message?: string;
  [key: string]: string | number | boolean | null | undefined;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authHeader = TokenService.getAuthHeader();
    console.log("token = ", TokenService.getToken())
    if (authHeader) {
      config.headers.Authorization = authHeader;
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
      TokenService.clearTokenData();
      window.location.href = '/';
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