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
} as const

// These are the messages and timing values used throughout authentication
export const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
  },
} as const

export const REDIRECT_DELAY = 2000 // milliseconds - time to wait before redirecting after successful login

export const FAQ = [
  {
    question: 'How do I start playing?',
    answer:
      'To start playing, create an account and log in. Then you can join a game or create your own tournament.',
  },
  {
    question: 'Can I play with friends?',
    answer:
      'Yes! You can invite friends to play by sharing your game room code or tournament link.',
  },
  {
    question: 'How do tournaments work?',
    answer:
      'Tournaments are organized in brackets. Players compete in matches, and winners advance to the next round until a champion is crowned.',
  },
]

export const gameRules = [
  {
    title: 'Basic Rules',
    description:
      "Players control paddles to hit the ball back and forth. The goal is to make the ball pass your opponent's paddle.",
  },
  {
    title: 'Scoring',
    description:
      "A point is scored when the ball passes the opponent's paddle. The first player to reach 11 points wins the game.",
  },
  {
    title: 'Power-ups',
    description:
      'Special power-ups appear during gameplay. Collect them to gain temporary advantages like speed boosts or paddle size changes.',
  },
]

export const troubleshootingSteps = [
  'Check your internet connection',
  'Clear your browser cache',
  'Try using a different browser',
  'Make sure your browser is up to date',
  'Disable any ad blockers or extensions that might interfere',
]

export const registerFormFields: FormFieldConfig[] = [
  {
    name: 'username',
    type: 'text',
    placeholder: 'Choose a username',
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Create a password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
  },
]

