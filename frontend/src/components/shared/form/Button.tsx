import React, { forwardRef } from 'react'

/**
 * A versatile button component that displays:
 * - Variants (solid, outline, ghost, link)
 * - Colors (primary, secondary, success, danger, warning)
 * - Sizes (sm, md, lg)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (buttons, actions, forms)
 */

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link'
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The variant of the button */
  variant?: ButtonVariant
  /** The color of the button */
  color?: ButtonColor
  /** The size of the button */
  size?: ButtonSize
  /** Whether the button is in a loading state */
  loading?: boolean
  /** The icon to display in the button */
  icon?: React.ReactNode
  /** The position of the icon */
  iconPosition?: 'left' | 'right'
  /** Whether the button takes full width */
  fullWidth?: boolean
  /** Additional CSS class name */
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      color = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

    const variantStyles = {
      solid: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary:
          'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        warning:
          'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
      },
      outline: {
        primary:
          'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary:
          'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
        success:
          'border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
        danger:
          'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
        warning:
          'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      },
      ghost: {
        primary: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        secondary: 'text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
        success: 'text-green-600 hover:bg-green-50 focus:ring-green-500',
        danger: 'text-red-600 hover:bg-red-50 focus:ring-red-500',
        warning: 'text-yellow-600 hover:bg-yellow-50 focus:ring-yellow-500',
      },
      link: {
        primary: 'text-blue-600 hover:text-blue-700 focus:ring-blue-500',
        secondary: 'text-gray-600 hover:text-gray-700 focus:ring-gray-500',
        success: 'text-green-600 hover:text-green-700 focus:ring-green-500',
        danger: 'text-red-600 hover:text-red-700 focus:ring-red-500',
        warning: 'text-yellow-600 hover:text-yellow-700 focus:ring-yellow-500',
      },
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const stateStyles = {
      disabled: 'opacity-50 cursor-not-allowed',
      loading: 'cursor-wait',
    }

    const combinedClassName = [
      baseStyles,
      variantStyles[variant][color],
      sizeStyles[size],
      (disabled || loading) && stateStyles.disabled,
      loading && stateStyles.loading,
      fullWidth && 'w-full',
      className,
    ].join(' ')

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 -ml-1 h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    )
  },
)
