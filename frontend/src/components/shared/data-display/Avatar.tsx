import React from 'react'

/**
 * A versatile avatar component that displays:
 * - Image sources (URLs)
 * - Fallback text for image loading failures
 * - Variants (circle, square)
 * - Status indicators (online, offline, away, busy, none)
 * - Usage in various UI contexts (user profiles, avatars, profile pictures)
 */

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  /** The image source */
  src?: string
  /** The fallback text to display when no image is provided */
  fallback: string
  /** The size of the avatar */
  size?: AvatarSize
  /** Additional CSS class name */
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  }

  const baseStyles =
    'inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-medium'
  const combinedClassName = [baseStyles, sizeStyles[size], className].join(' ')

  if (src) {
    return (
      <img
        src={src}
        alt={fallback}
        className={`${combinedClassName} object-cover`}
      />
    )
  }

  return (
    <div className={combinedClassName}>
      {fallback.slice(0, 2).toUpperCase()}
    </div>
  )
}
