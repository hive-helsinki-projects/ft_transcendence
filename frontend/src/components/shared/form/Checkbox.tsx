import React, { forwardRef } from 'react'

/**
 * A versatile checkbox component that displays:
 * - Sizes (sm, md, lg)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (forms, settings, toggles)
 */

export type CheckboxSize = 'sm' | 'md' | 'lg'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** The size of the checkbox */
  size?: CheckboxSize
  /** The label for the checkbox */
  label?: string
  /** Helper text to display below the checkbox */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Additional CSS class name */
  className?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      error,
      className = '',
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'rounded border-gray-300 text-blue-600 transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'

    const sizeStyles = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }

    const stateStyles = {
      disabled: 'opacity-50 cursor-not-allowed',
      error: 'border-red-500 focus:ring-red-500',
    }

    const combinedClassName = [
      baseStyles,
      sizeStyles[size],
      disabled && stateStyles.disabled,
      error && stateStyles.error,
      className,
    ].join(' ')

    return (
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            ref={ref}
            type="checkbox"
            className={combinedClassName}
            disabled={disabled}
            {...props}
          />
        </div>
        <div className="ml-3">
          {label && (
            <label
              className={`block text-sm font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {label}
            </label>
          )}
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
      </div>
    )
  },
)
