import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'
import { CardProps } from './types'

const cardVariants = {
  default: 'bg-white border border-gray-200',
  outlined: 'bg-white border-2 border-gray-300',
  elevated: 'bg-white shadow-lg border border-gray-100',
}

const paddingMap = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      header,
      footer,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg transition-shadow',
          cardVariants[variant],
          className,
        )}
        {...props}
      >
        {header && (
          <div
            className={cn(
              'border-b border-gray-200 px-4 py-3',
              padding === 'xs' && 'px-2 py-1.5 text-sm',
              padding === 'sm' && 'px-3 py-2',
              padding === 'lg' && 'px-6 py-4 text-lg',
              padding === 'xl' && 'px-8 py-5 text-xl',
            )}
          >
            {header}
          </div>
        )}

        <div className={cn(paddingMap[padding])}>{children}</div>

        {footer && (
          <div
            className={cn(
              'rounded-b-lg border-t border-gray-200 bg-gray-50 px-4 py-3',
              padding === 'xs' && 'px-2 py-1.5 text-sm',
              padding === 'sm' && 'px-3 py-2',
              padding === 'lg' && 'px-6 py-4',
              padding === 'xl' && 'px-8 py-5',
            )}
          >
            {footer}
          </div>
        )}
      </div>
    )
  },
)

Card.displayName = 'Card'

// Specialized card components
export const ContentCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="elevated" {...props} />
)

export const FormCard: React.FC<Omit<CardProps, 'variant' | 'padding'>> = (
  props,
) => <Card variant="outlined" padding="lg" {...props} />

export const CompactCard: React.FC<Omit<CardProps, 'padding'>> = (props) => (
  <Card padding="sm" {...props} />
)
