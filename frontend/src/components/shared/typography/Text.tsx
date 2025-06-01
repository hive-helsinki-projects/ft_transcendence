import React from 'react';

/**
 * A versatile text component that renders semantic HTML elements (p, span, div).
 * Features:
 * - Responsive text sizes (body, caption, small, large)
 * - Font weight options (normal, medium, semibold, bold)
 * - Color variants (primary, secondary, muted, error, success)
 * - Proper semantic HTML
 * - Usage in various UI contexts (paragraphs, labels, captions, small text)
 */

export type TextVariant = 'body' | 'caption' | 'small' | 'large';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor = 'primary' | 'secondary' | 'muted' | 'error' | 'success';

export interface TextProps {
  /** The content to be displayed */
  children: React.ReactNode;
  /** The variant of the text */
  variant?: TextVariant;
  /** The font weight */
  weight?: TextWeight;
  /** The text color */
  color?: TextColor;
  /** Additional CSS class name */
  className?: string;
  /** HTML element to render */
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  color = 'primary',
  className = '',
  as: Component = 'p',
}) => {
  const baseStyles = 'font-sans';
  
  const variantStyles = {
    body: 'text-base',
    caption: 'text-sm',
    small: 'text-xs',
    large: 'text-lg',
  };

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorStyles = {
    primary: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
    error: 'text-red-600',
    success: 'text-green-600',
  };

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    weightStyles[weight],
    colorStyles[color],
    className,
  ].join(' ');

  return <Component className={combinedClassName}>{children}</Component>;
};