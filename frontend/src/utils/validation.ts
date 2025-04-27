import { AuthFormData } from '../types/auth'

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword
}

export const validateRegistrationForm = (data: AuthFormData): { isValid: boolean; error: string | null } => {
  if (!data.username || !data.email || !data.password || !data.confirmPassword) {
    return { isValid: false, error: 'Please fill in all fields' }
  }

  if (!validatePassword(data.password, data.confirmPassword)) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  if (!validateEmail(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true, error: null }
} 