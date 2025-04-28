import { AuthFormData } from '../types/auth'
import { VALIDATION_RULES } from './constants'

/**
 * Validates a single form field
 */
export const validateField = (name: keyof AuthFormData, value: string): string => {
  const rules = VALIDATION_RULES[name]
  
  if (!value) return 'This field is required'
  if (value.length < rules.minLength) return `Must be at least ${rules.minLength} characters`
  if ('maxLength' in rules && value.length > rules.maxLength) {
    return `Must be less than ${rules.maxLength} characters`
  }
  if ('pattern' in rules && !rules.pattern.test(value)) {
    return 'Must contain only letters and numbers'
  }
  
  return ''
}

/**
 * Formats error message from API response
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

/**
 * Delays execution for a specified time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
} 