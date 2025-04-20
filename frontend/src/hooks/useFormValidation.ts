import { useState, useCallback } from 'react'
import { FormData, FormValidation } from '../types/auth'

const validateUsername = (username: string): string => {
  if (!username) return 'Username is required'
  if (username.length < 3) return 'Username must be at least 3 characters'
  if (username.length > 20) return 'Username must be less than 20 characters'
  if (!/^[a-zA-Z0-9]+$/.test(username)) return 'Username must contain only letters and numbers'
  return ''
}

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

export const useFormValidation = () => {
  const [validation, setValidation] = useState<FormValidation>({
    isValid: false,
    errors: {},
  })

  const validateForm = useCallback((formData: FormData): FormValidation => {
    const errors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
    }

    const isValid = Object.values(errors).every((error) => !error)

    return { isValid, errors }
  }, [])

  const updateValidation = useCallback((formData: FormData) => {
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