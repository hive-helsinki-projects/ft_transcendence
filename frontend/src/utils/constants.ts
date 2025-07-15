import { FormFieldConfig } from '@/types/auth'

// Base URL
export const API_URL = 'https://localhost:3001'

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/login',
  LOGIN_2FA: '/login/2fa',
  GOOGLE_AUTH: '/api/auth/google',
  REGISTER: '/register',
} as const

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
  email: {
    minLength: 5,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  confirmPassword: {
    minLength: 6,
  },
} as const

export const AUTH_MESSAGES = {
  SUCCESS: 'auth.success.login',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
  },
} as const

export const REDIRECT_DELAY = 2000 // milliseconds - time to wait before redirecting after successful login

export const FAQ = [
  {
    question: 'faq.start.question',
    answer: 'faq.start.answer',
  },
  {
    question: 'faq.tournaments.question',
    answer: 'faq.tournaments.answer',
  },
]

export const gameRules = [
  {
    title: 'rules.basic.title',
    description: 'rules.basic.description',
  },
  {
    title: 'rules.scoring.title',
    description: 'rules.scoring.description',
  },
]

export const troubleshootingSteps = [
  'troubleshooting.step1',
  'troubleshooting.step2',
  'troubleshooting.step3',
  'troubleshooting.step4',
  'troubleshooting.step5',
]
