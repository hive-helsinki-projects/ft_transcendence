import React, { useState } from 'react'
import { useFormValidation } from '../../../hooks/auth/useFormValidation'
import { AuthFormData, AuthFormProps } from '../../../types/auth'
import LoadingState from '../../LoadingState'
import '../../../assets/styles/index.css'

/**
 * Props for the FormInput component
 */
interface FormInputProps {
  name: keyof AuthFormData        // Name of the input field
  type: string                    // Type of input (text, password, etc.)
  value: string                   // Current value of the input
  placeholder: string             // Placeholder text
  error?: string                  // Error message to display
  disabled: boolean               // Whether the input is disabled
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void // Change handler
}

/**
 * Reusable input component for the authentication form
 * Handles input display, validation errors, and disabled state
 */
const FormInput: React.FC<FormInputProps> = ({
  name,
  type,
  value,
  placeholder,
  error,
  disabled,
  onChange,
}) => (
  <div className="form-group">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required
      className={error ? 'error' : ''}
    />
    {error && <span className="error-text">{error}</span>}
  </div>
)

const StatusMessage: React.FC<{ type: 'error' | 'success'; message: string }> = ({ type, message }) => (
  <div className={`${type}-message`}>{message}</div>
)

/**
 * Authentication Form Component
 * 
 * Handles user authentication through a form with username and password fields.
 * Includes validation, loading states, and error handling.
 */
const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading = false,
  error = '',
  successMessage = '',
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
      {successMessage && <StatusMessage type="success" message={successMessage} />}

      {/* Username Input */}
      <FormInput
        name="username"
        type="text"
        value={formData.username}
        placeholder="Username"
        error={validation.errors.username}
        disabled={isLoading}
        onChange={handleInputChange}
      />

      {/* Password Input */}
      <FormInput
        name="password"
        type="password"
        value={formData.password}
        placeholder="Password"
        error={validation.errors.password}
        disabled={isLoading}
        onChange={handleInputChange}
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="submit-button"
        disabled={isLoading || !validation.isValid}
      >
        {isLoading ? <LoadingState size="small" message="Signing in..." /> : 'Sign In'}
      </button>
    </form>
  )
}

export default AuthForm 