import React, { useState } from 'react'
import { useFormValidation } from '@hooks/index'
import { AuthFormData, AuthFormProps } from '@/types/auth'
import { LoadingState } from '@components/index'
import { FormInput } from './FormInput'
import { StatusMessage } from './StatusMessage'
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
  fields = [
    { name: 'username', type: 'text', placeholder: 'Username' },
    { name: 'password', type: 'password', placeholder: 'Password' },
  ],
}) => {
  // Form state
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
  })

  // Form validation
  const { validation, updateValidation } = useFormValidation()

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

      {fields.map((field) => (
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
        className="submit-button"
        disabled={isLoading || !validation.isValid}
      >
        {isLoading ? (
          <LoadingState message="Signing in..." />
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}


