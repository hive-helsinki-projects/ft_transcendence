import React, { forwardRef } from 'react'

/**
 * A versatile select component that displays:
 * - Variants (outline, filled, flushed)
 * - Sizes (sm, md, lg)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (forms, dropdowns, select inputs)
 */

export type SelectVariant = 'outline' | 'filled' | 'flushed'
export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** The variant of the select */
  variant?: SelectVariant
  /** The size of the select */
  size?: SelectSize
  /** The label for the select */
  label?: string
  /** Helper text to display below the select */
  helperText?: string
  /** Error message to display */
  error?: string
  /** The options for the select */
  options: SelectOption[]
  /** Additional CSS class name */
  className?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'outline',
      size = 'md',
      label,
      helperText,
      error,
      options,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'block w-full rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variantStyles = {
      outline: 'border border-gray-300 bg-white focus:ring-blue-500',
      filled: 'border-0 bg-gray-100 focus:ring-blue-500',
      flushed:
        'border-0 border-b-2 border-gray-300 rounded-none focus:ring-0 focus:border-blue-500',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const stateStyles = {
      disabled: 'opacity-50 cursor-not-allowed bg-gray-50',
      error: 'border-red-500 focus:ring-red-500',
    }

    const combinedClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      disabled && stateStyles.disabled,
      error && stateStyles.error,
      className,
    ].join(' ')

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={combinedClassName}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(helperText || error) && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  },
)
