import React, { useState } from 'react'
import { useFormValidation } from '../../hooks/useFormValidation'
import { AuthFormData, AuthFormProps } from '../../types/auth'
import LoadingState from '../LoadingState'
import '../../css'

interface FormInputProps {
  name: keyof AuthFormData
  type: string
  value: string
  placeholder: string
  error?: string
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

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

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading = false,
  error = '',
  successMessage = '',
}) => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
  })
  const { validation, updateValidation } = useFormValidation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    updateValidation({ ...formData, [name]: value })
  }

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
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <FormInput
        name="username"
        type="text"
        value={formData.username}
        placeholder="Username"
        error={validation.errors.username}
        disabled={isLoading}
        onChange={handleInputChange}
      />

      <FormInput
        name="password"
        type="password"
        value={formData.password}
        placeholder="Password"
        error={validation.errors.password}
        disabled={isLoading}
        onChange={handleInputChange}
      />

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