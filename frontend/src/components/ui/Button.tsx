import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'
import { Loading } from './Loading'
import { ButtonProps } from './types'

const buttonVariants = {
  default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600',
  success: 'bg-green-600 text-white hover:bg-green-700 border border-green-600',
  warning:
    'bg-yellow-600 text-white hover:bg-yellow-700 border border-yellow-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
}

const buttonSizes = {
  xs: 'px-2 py-1 text-xs h-6',
  sm: 'px-3 py-1.5 text-sm h-8',
  md: 'px-4 py-2 text-sm h-10',
  lg: 'px-6 py-3 text-base h-12',
  xl: 'px-8 py-4 text-lg h-14',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      children,
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant styles
          buttonVariants[variant],
          // Size styles
          buttonSizes[size],
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <Loading size={size === 'xs' ? 'xs' : 'sm'} variant="spinner" />
        )}

        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}

        <span>{isLoading && loadingText ? loadingText : children}</span>

        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'

// Pre-configured button variants for common use cases
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (
  props,
) => <Button variant="primary" {...props} />

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (
  props,
) => <Button variant="secondary" {...props} />

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="danger" {...props} />
)

export const LoadingButton: React.FC<ButtonProps & { loading?: boolean }> = ({
  loading,
  ...props
}) => <Button isLoading={loading} {...props} />
