import React from 'react'

/**
 * A versatile card component that provides:
 * - Variants (elevated, outlined, filled)
 * - Padding options (none, small, medium, large)
 * - Border radius options (none, small, medium, large)
 * - Interactive state (hoverable)
 * - Usage in various UI contexts (content containers, panels, cards)
 */

export type CardVariant = 'elevated' | 'outlined' | 'filled'
export type CardPadding = 'none' | 'small' | 'medium' | 'large'
export type CardRadius = 'none' | 'small' | 'medium' | 'large'

export interface CardProps {
  /** The visual variant of the card */
  variant?: CardVariant
  /** The padding inside the card */
  padding?: CardPadding
  /** The border radius of the card */
  radius?: CardRadius
  /** Whether the card is interactive (hoverable) */
  interactive?: boolean
  /** Additional CSS class name */
  className?: string
  /** The content to be displayed */
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  radius = 'medium',
  interactive = false,
  className = '',
  children,
}) => {
  const baseStyles = 'bg-white'

  const variantStyles = {
    elevated: 'shadow-md',
    outlined: 'border border-gray-200',
    filled: 'bg-gray-50',
  }

  const paddingStyles = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  }

  const radiusStyles = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
  }

  const interactiveStyles = interactive
    ? 'transition-shadow duration-200 hover:shadow-lg cursor-pointer'
    : ''

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    paddingStyles[padding],
    radiusStyles[radius],
    interactiveStyles,
    className,
  ].join(' ')

  return <div className={combinedClassName}>{children}</div>
}
