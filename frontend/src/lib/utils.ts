/**
 * Utility function to merge class names
 * Simple implementation for combining conditional CSS classes
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
} 