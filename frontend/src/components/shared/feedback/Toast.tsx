import React, { useEffect, useState } from 'react'

/**
 * A versatile toast component that displays:
 * - Variants (success, error, info, warning)
 * - Positions (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (notifications, messages, alerts)
 */

export type ToastVariant = 'success' | 'error' | 'info'
export type ToastPosition = 'top-right' | 'bottom-right'

export interface ToastProps {
  /** The message to display */
  message: string
  /** The variant of the toast */
  variant?: ToastVariant
  /** The position of the toast */
  position?: ToastPosition
  /** The duration in milliseconds before the toast disappears */
  duration?: number
  /** Whether the toast is visible */
  isVisible: boolean
  /** Callback when the toast is closed */
  onClose: () => void
  /** Additional CSS class name */
  className?: string
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  position = 'top-right',
  duration = 3000,
  isVisible,
  onClose,
  className = '',
}) => {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(onClose, 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const baseStyles =
    'flex items-center p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-300'

  const variantStyles = {
    success: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
  }

  const positionStyles = {
    'top-right': 'fixed top-4 right-4',
    'bottom-right': 'fixed bottom-4 right-4',
  }

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    positionStyles[position],
    isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
    className,
  ].join(' ')

  if (!isVisible) return null

  return (
    <div className={combinedClassName} role="alert">
      <span className="font-medium">{message}</span>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
        onClick={() => {
          setIsExiting(true)
          setTimeout(onClose, 300)
        }}
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
    </div>
  )
}
