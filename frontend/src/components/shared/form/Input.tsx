import React, { forwardRef } from 'react'

/**
 * A versatile input component that displays:
 * - Variants (outlined, filled, flushed)
 * - Sizes (sm, md, lg)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (forms, search inputs, text inputs)
 */

export type InputVariant = 'outlined' | 'filled' | 'flushed'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The variant of the input */
  variant?: InputVariant
  /** The size of the input */
  size?: InputSize
  /** The label of the input */
  label?: string
  /** The helper text of the input */
  helperText?: string
  /** Whether the input is in an error state */
  error?: boolean
  /** The start icon of the input */
  startIcon?: React.ReactNode
  /** The end icon of the input */
  endIcon?: React.ReactNode
  /** Additional CSS class name */
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error = false,
      startIcon,
      endIcon,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'w-full rounded-md border bg-white transition-colors duration-200'

    const variantStyles = {
      outlined:
        'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      filled:
        'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      flushed: 'border-x-0 border-t-0 border-b-2 rounded-none focus:ring-0',
    }

    const sizeStyles = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    }

    const stateStyles = {
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
      disabled: 'bg-gray-100 cursor-not-allowed opacity-60',
    }

    const combinedInputClassName = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      error && stateStyles.error,
      disabled && stateStyles.disabled,
      className,
    ].join(' ')

    return (
      <div className="w-full">
        {label && (
          <label
            className={`mb-1 block text-sm font-medium ${
              error ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${combinedInputClassName} ${
              startIcon ? 'pl-10' : ''
            } ${endIcon ? 'pr-10' : ''}`}
            disabled={disabled}
            {...props}
          />
          {endIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {endIcon}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  },
)
