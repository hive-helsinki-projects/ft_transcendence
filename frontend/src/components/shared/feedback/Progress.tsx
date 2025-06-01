import React from 'react'

/**
 * A versatile progress bar component that displays:
 * - Variants (primary, success, warning, error)
 * - Sizes (sm, md, lg)
 * - Shapes (line, circle)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (loading states, progress indicators, progress bars)
 */

export type ProgressSize = 'sm' | 'md' | 'lg'

export interface ProgressProps {
  /** The current progress value (0-100) */
  value: number
  /** The size of the progress bar */
  size?: ProgressSize
  /** Whether to show the progress value */
  showValue?: boolean
  /** Additional CSS class name */
  className?: string
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  size = 'md',
  showValue = false,
  className = '',
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  }

  const baseStyles = 'w-full bg-gray-200 rounded-full overflow-hidden'
  const progressStyles = 'bg-blue-600 transition-all duration-300 ease-in-out'

  const combinedClassName = [baseStyles, sizeStyles[size], className].join(' ')

  return (
    <div className="w-full">
      <div className={combinedClassName}>
        <div
          className={progressStyles}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-right text-sm text-gray-600">
          {clampedValue}%
        </div>
      )}
    </div>
  )
}
