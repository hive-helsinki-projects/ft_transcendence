import React, { useState } from 'react'
import { useFormValidation } from '../../hooks/useFormValidation'
import { AuthFormData, AuthFormProps } from '../../types/auth'
import LoadingState from '../LoadingState'
import '../../css/LandingPage.css'

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
    setFormData((prev: AuthFormData) => ({ ...prev, [name]: value }))
    updateValidation({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { isValid } = updateValidation(formData)
    if (isValid) {
      await onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {error && <div className="error-message" role="alert">{error}</div>}
      {successMessage && (
        <div className="success-message" role="status">{successMessage}</div>
      )}

      <div className="form-group">
        <label htmlFor="username" className="sr-only">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          aria-invalid={!!validation.errors.username}
          aria-describedby={validation.errors.username ? 'username-error' : undefined}
        />
        {validation.errors.username && (
          <span id="username-error" className="error-text" role="alert">
            {validation.errors.username}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="sr-only">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          aria-invalid={!!validation.errors.password}
          aria-describedby={validation.errors.password ? 'password-error' : undefined}
        />
        {validation.errors.password && (
          <span id="password-error" className="error-text" role="alert">
            {validation.errors.password}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading || !validation.isValid}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <LoadingState size="small" message="Signing in..." />
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}

export default AuthForm 