import React from 'react'

/**
 * A powerful flex container that allows for:
 * - Flexible direction options (row, column, row-reverse, column-reverse)
 * - Justify content alignment (start, end, center, between, around, evenly)
 * - Align items positioning (start, end, center, stretch, baseline)
 * - Wrap behavior control (nowrap, wrap, wrap-reverse)
 * - Configurable gap spacing between items (none, small, medium, large)
 * - Optional grow behavior to fill available space
 * - Usage in various UI contexts (flex containers, layouts, grids)
 */

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly'
export type FlexAlign = 'start' | 'end' | 'center' | 'stretch' | 'baseline'
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
export type FlexGap = 'none' | 'small' | 'medium' | 'large'

export interface FlexProps {
  /** The flex direction */
  direction?: FlexDirection
  /** The justify-content value */
  justify?: FlexJustify
  /** The align-items value */
  align?: FlexAlign
  /** The flex-wrap value */
  wrap?: FlexWrap
  /** The gap between items */
  gap?: FlexGap
  /** Whether the flex container should grow to fill available space */
  grow?: boolean
  /** Additional CSS class name */
  className?: string
  /** The content to be displayed */
  children: React.ReactNode
}

export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'nowrap',
  gap = 'none',
  grow = false,
  className = '',
  children,
}) => {
  const baseStyles = 'flex'

  const directionStyles = {
    row: 'flex-row',
    column: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'column-reverse': 'flex-col-reverse',
  }

  const justifyStyles = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }

  const alignStyles = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }

  const wrapStyles = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  }

  const gapStyles = {
    none: '',
    small: 'gap-2',
    medium: 'gap-4',
    large: 'gap-6',
  }

  const combinedClassName = [
    baseStyles,
    directionStyles[direction],
    justifyStyles[justify],
    alignStyles[align],
    wrapStyles[wrap],
    gapStyles[gap],
    grow ? 'flex-grow' : '',
    className,
  ].join(' ')

  return <div className={combinedClassName}>{children}</div>
}
