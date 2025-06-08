import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'
import { InputProps } from './types'

const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
}

const inputSizes = {
  xs: 'px-2 py-1 text-xs h-6',
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-3 py-2 text-sm h-10',
  lg: 'px-4 py-3 text-base h-12',
  xl: 'px-4 py-4 text-lg h-14',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size = 'md',
      variant = 'default',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const inputVariant = error ? 'error' : variant

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              // Base styles
              'block w-full rounded-md border shadow-sm transition-colors',
              'focus:ring-2 focus:ring-offset-0 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              // Variant styles
              inputVariants[inputVariant],
              // Size styles
              inputSizes[size],
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'

// Legacy FormField component for backward compatibility
export const FormField: React.FC<{
  name: string
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: string
  label?: string
}> = ({ name, type, placeholder, value, onChange, disabled, error, label }) => (
  <Input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    disabled={disabled}
    error={error}
    label={label}
    variant={error ? 'error' : 'default'}
  />
)
