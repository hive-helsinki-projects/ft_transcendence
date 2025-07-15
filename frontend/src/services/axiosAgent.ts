import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import i18next from 'i18next'

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

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    console.log('token = ', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      // Only redirect if user has a token (expired/invalid session)
      // If no token, they're already trying to login, so show the error
      const hasToken = localStorage.getItem('token')
      if (hasToken) {
        localStorage.removeItem('token')
        window.location.href = '/'
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message)
      return Promise.reject(
        new Error(i18next.t('networkError')),
      )
    }

    // Handle specific error status codes
    const errorMessage = String(error.response.data?.error || error.response.data?.message || 'An error occurred')
    return Promise.reject(new Error(errorMessage))
  },
)
