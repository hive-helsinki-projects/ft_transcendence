// Authentication
export { default as authService } from './authService'
export { default as localAuth } from './localAuth'
export { AuthContext, AuthProvider } from './AuthContext'

// API clients
export { default as api } from './api'
export { default as axiosAgent } from './axiosAgent'
export { default as baseService } from './baseService'
export { default as BaseService } from './baseService'

// Data
export { default as helpData } from './helpData'

// Re-export hooks for convenience
export { default as useAuth } from '../hooks/useAuth'
