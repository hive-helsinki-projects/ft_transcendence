import React from 'react'

/**
 * A versatile divider component that creates horizontal or vertical lines.
 * Features:
 * - Configurable orientation (horizontal, vertical)
 * - Gap spacing options (none, small, medium, large)
 * - Proper accessibility attributes
 * - Usage in various UI contexts (separators, dividers, section breaks)
 */

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerSpacing = 'none' | 'small' | 'medium' | 'large'

export interface DividerProps {
  /** The orientation of the divider */
  orientation?: DividerOrientation
  /** The spacing around the divider */
  spacing?: DividerSpacing
  /** Additional CSS class name */
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing = 'medium',
  className = '',
}) => {
  const baseStyles = 'bg-gray-200'

  const orientationStyles = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px',
  }

  const spacingStyles = {
    none: '',
    small: orientation === 'horizontal' ? 'my-2' : 'mx-2',
    medium: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    large: orientation === 'horizontal' ? 'my-6' : 'mx-6',
  }

  const combinedClassName = [
    baseStyles,
    orientationStyles[orientation],
    spacingStyles[spacing],
    className,
  ].join(' ')

  return <div className={combinedClassName} role="separator" />
}
