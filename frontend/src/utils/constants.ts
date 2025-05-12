/**
 * Authentication related constants
 */

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  GOOGLE_AUTH: '/api/auth/google',
} as const

// Messages
export const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
    INVALID_CREDENTIALS: 'Invalid username or password',
    NETWORK_ERROR: 'Network error. Please try again.',
  },
} as const

// Timing
export const REDIRECT_DELAY = 2000 // milliseconds

// Validation
export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9]+$/,
  },
  password: {
    minLength: 6,
  },
} as const 