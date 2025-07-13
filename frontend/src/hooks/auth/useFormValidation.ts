import { AuthFormData, FormValidation } from '@/types/auth'
import { useCallback, useState } from 'react'
import { useTranslate } from '@/hooks/useTranslate'

/**
 * Creates validation rules with translations
 */
const createValidationRules = (t: (key: string) => string) => ({
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9]+$/,
    messages: {
      required: t('auth.usernameRequired') || 'Username is required',
      minLength: t('auth.usernameMinLength') || 'Username must be at least 3 characters',
      maxLength: t('auth.usernameMaxLength') || 'Username must be less than 20 characters',
      pattern: t('auth.usernamePattern') || 'Username must contain only letters and numbers',
    },
  },
  password: {
    minLength: 6,
    messages: {
      required: t('auth.passwordRequired') || 'Password is required',
      minLength: t('auth.passwordMinLength') || 'Password must be at least 6 characters',
    },
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: t('auth.emailRequired') || 'Email is required',
      pattern: t('auth.emailPattern') || 'Please enter a valid email address',
    },
  },
  confirmPassword: {
    minLength: 6,
    messages: {
      required: t('auth.confirmPasswordRequired') || 'Password confirmation is required',
      minLength: t('auth.confirmPasswordMinLength') || 'Password confirmation must be at least 6 characters',
      match: t('auth.confirmPasswordMatch') || 'Passwords do not match',
    },
  },
})

/**
 * Custom hook for handling form validation
 *
 * This hook provides a validation state and methods for validating form fields
 * It includes a validateField function for validating individual fields
 * and a validateForm function for validating the entire form
 */
export const useFormValidation = () => {
  const t = useTranslate()
  const VALIDATION_RULES = createValidationRules(t)
  
  const [validation, setValidation] = useState<FormValidation>({
    isValid: false,
    errors: {},
  })

  const validateField = useCallback(
    (name: keyof AuthFormData, value: string, formData?: AuthFormData): string => {
      const rules = VALIDATION_RULES[name]
      if (!rules) return '' // Skip validation for fields without rules
      if (!value) return rules.messages.required
      if ('minLength' in rules && value.length < rules.minLength) return rules.messages.minLength
      if ('maxLength' in rules && value.length > rules.maxLength)
        return rules.messages.maxLength
      if ('pattern' in rules && !rules.pattern.test(value))
        return rules.messages.pattern
      
      // Special validation for confirmPassword
      if (name === 'confirmPassword' && formData) {
        if (value !== formData.password) {
          return t('auth.confirmPasswordMatch') || 'Passwords do not match'
        }
      }
      
      return ''
    },
    [VALIDATION_RULES, t],
  )

  const validateForm = useCallback(
    (formData: AuthFormData): FormValidation => {
      const errors: Record<string, string> = {}

      // Validate all fields that are present in the form data
      Object.keys(formData).forEach((key) => {
        const fieldName = key as keyof AuthFormData
        const value = formData[fieldName] || ''
        
        // Validate all fields that have validation rules
        if (VALIDATION_RULES[fieldName]) {
          errors[fieldName] = validateField(fieldName, value, formData)
        }
      })

      const isValid = Object.values(errors).every((error) => !error)

      return { isValid, errors }
    },
    [validateField, VALIDATION_RULES],
  )

  const updateValidation = useCallback(
    (formData: AuthFormData) => {
      const newValidation = validateForm(formData)
      setValidation(newValidation)
      return newValidation
    },
    [validateForm],
  )

  return {
    validation,
    updateValidation,
    validateForm,
  }
}
