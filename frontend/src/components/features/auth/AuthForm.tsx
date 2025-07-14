import React, { useState } from 'react'
import { useFormValidation } from '@hooks/index'
import { AuthFormData, AuthFormProps } from '@/types/auth'
import { LoadingState } from '@components/index'
import { FormInput } from './FormInput'
import { StatusMessage } from './StatusMessage'
import { useTranslate } from '@/hooks/useTranslate'
import '@assets/styles/index.css'

/**
 * Authentication Form Component
 *
 * Handles user authentication through a form with username and password fields.
 * Includes validation, loading states, and error handling.
 */
export const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading = false,
  error = '',
  successMessage = '',
  fields,
  buttonText,
  loadingText,
}) => {
  const t = useTranslate()

  // Default fields with translations
  const defaultFields = [
    { name: 'username', type: 'text', placeholder: t('auth.username') || 'Username' },
    { name: 'password', type: 'password', placeholder: t('auth.password') || 'Password' },
  ]
  
  // Ensure we always have a valid array
  const formFields = fields || defaultFields || [
    { name: 'username', type: 'text', placeholder: 'Username' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ]

  // Form state - initialize with all possible fields
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  })

  // Form validation - only validate fields that are actually in the form
  const activeFieldNames = formFields.map(field => field.name)
  const { validation, updateValidation } = useFormValidation(activeFieldNames)

  /**
   * Handles input changes and updates form validation
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    updateValidation(newFormData)
  }

  /**
   * Handles form submission
   * Validates the form before submitting
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { isValid } = updateValidation(formData)

    if (isValid) {
      try {
        await onSubmit(formData)
      } catch (err) {
        console.error('Form submission error:', err)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {error && <StatusMessage type="error" message={error} />}
      {successMessage && (
        <StatusMessage type="success" message={successMessage} />
      )}

      {formFields.map((field) => (
        <FormInput
          key={field.name}
          name={field.name}
          type={field.type}
          value={formData[field.name as keyof AuthFormData] || ''}
          placeholder={field.placeholder}
          error={validation.errors[field.name]}
          disabled={isLoading}
          onChange={handleInputChange}
        />
      ))}

      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading || !validation.isValid}
      >
        {isLoading ? (
          <LoadingState message={loadingText || t('auth.signingIn')} />
        ) : (
          buttonText || t('auth.signIn')
        )}
      </button>
    </form>
  )
}


