import React from 'react'
import '../../../assets/styles/index.css'

interface FormInputProps {
  name: string
  type: string
  value: string
  placeholder: string
  error?: string
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

/**
 * Reusable input component for forms
 * Handles input display, validation errors, and disabled state
 */
export const FormInput: React.FC<FormInputProps> = ({
  name,
  type,
  value,
  placeholder,
  error,
  disabled,
  onChange,
  required = true,
}) => (
  <div className="form-group">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={error ? 'error' : ''}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <span id={`${name}-error`} className="error-text">
        {error}
      </span>
    )}
  </div>
)
