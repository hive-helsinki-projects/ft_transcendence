import { useState, useCallback } from 'react'
import { AuthFormData, FormValidation } from '../../types/auth'

/**
 * Validation rules for the authentication form
 * 
 * This object defines the validation rules for the authentication form fields
 * It includes rules for the username and password fields
 */
const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9]+$/,
    messages: {
      required: 'Username is required',
      minLength: 'Username must be at least 3 characters',
      maxLength: 'Username must be less than 20 characters',
      pattern: 'Username must contain only letters and numbers',
    },
  },
  password: {
    minLength: 6,
    messages: {
      required: 'Password is required',
      minLength: 'Password must be at least 6 characters',
    },
  },
} as const

/**
 * Custom hook for handling form validation
 * 
 * This hook provides a validation state and methods for validating form fields
 * It includes a validateField function for validating individual fields
 * and a validateForm function for validating the entire form
 */
export const useFormValidation = () => {
  const [validation, setValidation] = useState<FormValidation>({
    isValid: false,
    errors: {},
  })

  const validateField = useCallback((name: keyof AuthFormData, value: string): string => {
    const rules = VALIDATION_RULES[name]
    if (!value) return rules.messages.required
    if (value.length < rules.minLength) return rules.messages.minLength
    if ('maxLength' in rules && value.length > rules.maxLength) return rules.messages.maxLength
    if ('pattern' in rules && !rules.pattern.test(value)) return rules.messages.pattern
    return ''
  }, [])

  const validateForm = useCallback((formData: AuthFormData): FormValidation => {
    const errors = {
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
    }

    const isValid = Object.values(errors).every((error) => !error)

    return { isValid, errors }
  }, [validateField])

  const updateValidation = useCallback((formData: AuthFormData) => {
    const newValidation = validateForm(formData)
    setValidation(newValidation)
    return newValidation
  }, [validateForm])

  return {
    validation,
    updateValidation,
    validateForm,
  }
} 