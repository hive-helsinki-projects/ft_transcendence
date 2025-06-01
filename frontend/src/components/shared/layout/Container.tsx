import React from 'react'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type ContainerPadding = 'none' | 'small' | 'medium' | 'large'

/**
 * A responsive container component that provides a consistent layout structure.
 * Features:
 * - Configurable maximum width (sm, md, lg, xl, full)
 * - Padding options (none, small, medium, large)
 * - Proper margin handling
 * - Responsive design
 * - Usage in various UI contexts (content containers, page layouts, sections)
 */

export interface ContainerProps {
  /** The maximum width of the container */
  size?: ContainerSize
  /** The padding around the container */
  padding?: ContainerPadding
  /** Additional CSS class name */
  className?: string
  /** The content to be displayed */
  children: React.ReactNode
}

export const Container: React.FC<ContainerProps> = ({
  size = 'lg',
  padding = 'medium',
  className = '',
  children,
}) => {
  const baseStyles = 'mx-auto'

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  }

  const paddingStyles = {
    none: '',
    small: 'px-4',
    medium: 'px-6',
    large: 'px-8',
  }

  const combinedClassName = [
    baseStyles,
    sizeStyles[size],
    paddingStyles[padding],
    className,
  ].join(' ')

  return <div className={combinedClassName}>{children}</div>
}
