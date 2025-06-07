/**
 * Authentication related constants
 */

// API Configuration
const API_BASE_URL = 'https://localhost:3001'

// API Endpoints
const API_ENDPOINTS = {
  LOGIN: '/login',
  LOGIN_2FA: '/login/2fa',
  GOOGLE_AUTH: '/api/auth/google',
  REGISTER: '/register',
} as const

// Messages
const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
    INVALID_CREDENTIALS: 'Invalid username or password',
    NETWORK_ERROR: 'Network error. Please try again.',
  },
} as const

// Timing
const REDIRECT_DELAY = 2000 // milliseconds

// Validation
const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9]+$/,
  },
  password: {
    minLength: 6,
  },
} as const

export { API_BASE_URL, API_ENDPOINTS, AUTH_MESSAGES, REDIRECT_DELAY, VALIDATION_RULES }