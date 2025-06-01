import React, { useEffect } from 'react'

/**
 * A versatile modal component that displays:
 * - Position options (top, right, bottom, left)
 * - Variants (light, dark)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (dialogs, modals, overlays)
 */

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** The title of the modal */
  title: string
  /** The size of the modal */
  size?: ModalSize
  /** Callback when the modal is closed */
  onClose: () => void
  /** Additional CSS class name */
  className?: string
  /** The content to be displayed */
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  size = 'md',
  onClose,
  className = '',
  children,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  const baseStyles = 'fixed inset-0 z-50 overflow-y-auto'
  const overlayStyles =
    'fixed inset-0 bg-black bg-opacity-50 transition-opacity'
  const modalStyles = 'relative mx-auto my-8 rounded-lg bg-white shadow-xl'
  const contentStyles = 'p-6'

  const combinedClassName = [baseStyles, className].join(' ')

  return (
    <div className={combinedClassName} role="dialog" aria-modal="true">
      <div className={overlayStyles} onClick={onClose} />
      <div className={`${modalStyles} ${sizeStyles[size]}`}>
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <button
            type="button"
            className="rounded-lg p-1 hover:bg-gray-100 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className={contentStyles}>{children}</div>
      </div>
    </div>
  )
}
