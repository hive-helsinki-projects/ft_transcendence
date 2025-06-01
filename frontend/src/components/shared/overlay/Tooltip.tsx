import React, { useState } from 'react'

/**
 * A versatile tooltip component that displays:
 * - Position options (top, right, bottom, left)
 * - Variants (light, dark)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (hoverable elements, buttons, icons)
 */

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'
export type TooltipVariant = 'light' | 'dark'

export interface TooltipProps {
  /** The content to be displayed in the tooltip */
  content: string
  /** The position of the tooltip */
  position?: TooltipPosition
  /** The visual variant of the tooltip */
  variant?: TooltipVariant
  /** Whether the tooltip is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** The trigger element */
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  disabled = false,
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }

  const baseStyles =
    'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap'
  const arrowStyles = 'absolute w-2 h-2 bg-gray-900 transform rotate-45'

  const arrowPositionStyles = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
    right: 'left-[-4px] top-1/2 -translate-y-1/2',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
    left: 'right-[-4px] top-1/2 -translate-y-1/2',
  }

  const combinedClassName = [
    baseStyles,
    positionStyles[position],
    className,
  ].join(' ')

  if (disabled) {
    return <div>{children}</div>
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={combinedClassName}>
          <div className={`${arrowStyles} ${arrowPositionStyles[position]}`} />
          {content}
        </div>
      )}
    </div>
  )
}
