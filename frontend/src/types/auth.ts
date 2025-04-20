export interface FormData {
  username: string
  password: string
}

export interface AuthFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isLoading: boolean
  error: string
  successMessage: string
}

export interface AuthSectionProps {
  onGoogleAuth: () => void
  onNavigateToRegister: () => void
  children: React.ReactNode
}

export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

export interface AuthState {
  isLoading: boolean
  error: string
  successMessage: string
} 