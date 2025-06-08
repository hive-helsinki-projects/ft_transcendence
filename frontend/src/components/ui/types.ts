import { ReactNode, HTMLAttributes, ButtonHTMLAttributes, InputHTMLAttributes } from 'react'

// Base component props
export interface BaseProps {
  className?: string
  children?: ReactNode
}

// Size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Color variants  
export type Variant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'

// Button props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  loadingText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

// Input props
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  size?: Size
  variant?: 'default' | 'error' | 'success'
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

// Loading props
export interface LoadingProps {
  size?: Size
  variant?: 'spinner' | 'dots' | 'pulse'
  message?: string
  overlay?: boolean
}

// Alert props
export interface AlertProps extends BaseProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  onClose?: () => void
  closable?: boolean
}

// Card props
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: Size
  header?: ReactNode
  footer?: ReactNode
}

// Modal props
export interface ModalProps extends BaseProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: Size
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
}

// Container props
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  center?: boolean
}

// Typography props
export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div' | 'label'
  size?: Size
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'error'
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: Size
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
} 