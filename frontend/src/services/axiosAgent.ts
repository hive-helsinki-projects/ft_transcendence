import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_ENDPOINTS } from '@/utils/constants'

interface ErrorResponse {
  message?: string
  [key: string]: string | number | boolean | null | undefined
}

export const api = axios.create({
  baseURL: 'https://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Enable sending cookies in cross-origin requests
})

// Add JWT token to non-auth requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    const isAuthEndpoint = Object.values(API_ENDPOINTS).some(endpoint => config.url?.includes(endpoint))
    
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Handle 401 unauthorized - auto logout
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    
    return Promise.reject(error)
  },
)
