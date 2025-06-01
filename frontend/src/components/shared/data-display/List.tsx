import React from 'react'

/**
 * A versatile list component that displays:
 * - Variants (ordered, unordered, none)
 * - Spacing options (none, small, medium, large)
 * - List marker styles (none, disc, decimal, circle, square)
 * - Usage in various UI contexts (ordered lists, unordered lists, description lists)
 */

export type ListVariant = 'ordered' | 'unordered'

export interface ListProps {
  /** The variant of the list */
  variant?: ListVariant
  /** Whether the list is dense */
  dense?: boolean
  /** Additional CSS class name */
  className?: string
  /** The list items */
  children: React.ReactNode
}

export const List: React.FC<ListProps> = ({
  variant = 'unordered',
  dense = false,
  className = '',
  children,
}) => {
  const baseStyles = 'list-none p-0'
  const denseStyles = dense ? 'space-y-1' : 'space-y-2'

  const combinedClassName = [baseStyles, denseStyles, className].join(' ')

  if (variant === 'ordered') {
    return (
      <ol className={combinedClassName} style={{ listStyleType: 'decimal' }}>
        {children}
      </ol>
    )
  }

  return (
    <ul className={combinedClassName} style={{ listStyleType: 'disc' }}>
      {children}
    </ul>
  )
}
