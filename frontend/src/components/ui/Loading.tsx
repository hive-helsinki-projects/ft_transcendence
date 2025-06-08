import { cn } from '@/lib/utils'
import React from 'react'
import { LoadingProps } from './types'

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const Spinner: React.FC<{ size: LoadingProps['size'] }> = ({ size = 'md' }) => (
  <div
    className={cn(
      'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
      sizeClasses[size],
    )}
  />
)

const Dots: React.FC<{ size: LoadingProps['size'] }> = ({ size = 'md' }) => {
  const dotSize =
    size === 'xs' ? 'h-1 w-1' : size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn('animate-pulse rounded-full bg-blue-600', dotSize)}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  )
}

const Pulse: React.FC<{ size: LoadingProps['size'] }> = ({ size = 'md' }) => (
  <div
    className={cn('animate-pulse rounded-full bg-blue-600', sizeClasses[size])}
  />
)

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  message,
  overlay = false,
}) => {
  const LoadingComponent = {
    spinner: Spinner,
    dots: Dots,
    pulse: Pulse,
  }[variant]

  const content = (
    <div className="flex flex-col items-center justify-center space-y-2">
      <LoadingComponent size={size} />
      {message && (
        <p
          className={cn(
            'animate-pulse text-gray-600',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-sm',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl',
          )}
        >
          {message}
        </p>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-lg bg-white p-6 shadow-xl">{content}</div>
      </div>
    )
  }

  return content
}

// Utility function to create loading states
export const createLoadingState =
  (props: Partial<LoadingProps> = {}) =>
  () => <Loading {...props} />

// Pre-configured loading components for common use cases
export const LoadingSpinner = createLoadingState({ variant: 'spinner' })
export const LoadingDots = createLoadingState({ variant: 'dots' })
export const LoadingOverlay = createLoadingState({ overlay: true })
export const LoadingButton = createLoadingState({
  size: 'sm',
  variant: 'spinner',
})
