export interface AuthFormData {
  username: string
  password: string
}

export interface AuthFormProps {
  onSubmit: (formData: AuthFormData) => Promise<void>
  isLoading?: boolean
  error?: string
  successMessage?: string
}

export interface AuthSectionProps {
  onGoogleAuth: () => void
  onNavigateToRegister: () => void
  children?: React.ReactNode
}

export interface AuthMessages {
  SUCCESS: string
  ERROR: {
    DEFAULT: string
  }
}

export const AUTH_MESSAGES: AuthMessages = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
  },
} as const

export const REDIRECT_DELAY = 2000

export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

export interface AuthState {
  isLoading: boolean
  error: string
  successMessage: string
} 