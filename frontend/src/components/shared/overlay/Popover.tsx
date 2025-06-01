import React, { useEffect, useRef, useState } from 'react'

/**
 * A versatile popover component that displays:
 * - Position options (top, right, bottom, left)
 * - Trigger types (click, hover)
 * - Interactive state (clickable)
 * - Usage in various UI contexts (dropdowns, tooltips, menus)
 */

export type PopoverPosition = 'top' | 'right' | 'bottom' | 'left'

export interface PopoverProps {
  /** The content to be displayed in the popover */
  content: React.ReactNode
  /** The position of the popover */
  position?: PopoverPosition
  /** Whether the popover is disabled */
  disabled?: boolean
  /** Additional CSS class name */
  className?: string
  /** The trigger element */
  children: React.ReactNode
}

export const Popover: React.FC<PopoverProps> = ({
  content,
  position = 'bottom',
  disabled = false,
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  }

  const baseStyles = 'absolute z-50 w-max rounded-lg bg-white p-2 shadow-lg'
  const arrowStyles = 'absolute w-2 h-2 bg-white transform rotate-45'

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
    return <div ref={triggerRef}>{children}</div>
  }

  return (
    <div className="relative inline-block">
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>
      {isOpen && (
        <div ref={popoverRef} className={combinedClassName}>
          <div className={`${arrowStyles} ${arrowPositionStyles[position]}`} />
          {content}
        </div>
      )}
    </div>
  )
}
