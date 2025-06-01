import React from 'react'

/**
 * A versatile alert component that displays:
 * - Variants (info, success, warning, error)
 * - Sizes (sm, md, lg)
 * - Dismissable state
 * - Usage in various UI contexts (notifications, messages, warnings)
 */

export type AlertVariant = 'info' | 'success' | 'error'

export interface AlertProps {
  /** The message to display */
  message: string
  /** The variant of the alert */
  variant?: AlertVariant
  /** Whether the alert can be dismissed */
  dismissible?: boolean
  /** Callback when the alert is dismissed */
  onDismiss?: () => void
  /** Additional CSS class name */
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  message,
  variant = 'info',
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const variantStyles = {
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
  }

  const baseStyles = 'p-4 rounded-lg flex items-center'
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    className,
  ].join(' ')

  return (
    <div className={combinedClassName} role="alert">
      <span className="font-medium">{message}</span>
      {dismissible && onDismiss && (
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
          onClick={onDismiss}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
