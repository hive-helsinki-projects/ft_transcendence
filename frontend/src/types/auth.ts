/**
 * Authentication related type definitions
 * 
 * This file contains all the type definitions needed for authentication in the application.
 * It includes types for form data, component props, state management, and more.
 */

// Form Data Types
// These types define the structure of data used in authentication forms
export interface AuthFormData {
  username: string  // The user's chosen username
  password: string  // The user's password
}

// Component Props Types
// These types define the props that authentication components expect to receive
export interface AuthFormProps {
  onSubmit: (formData: AuthFormData) => Promise<void>  // Function to handle form submission
  isLoading?: boolean                                  // Whether the form is currently processing
  error?: string                                      // Any error message to display
  successMessage?: string                             // Any success message to display
}

export interface AuthSectionProps {
  onGoogleAuth: () => void                            // Function to handle Google authentication
  onNavigateToRegister: () => void                    // Function to navigate to registration page
  children?: React.ReactNode                          // Child components to render
}

// State Types
// These types define the shape of state used in authentication
export interface AuthState {
  isLoading: boolean    // Whether an authentication operation is in progress
  error: string        // Any error message from authentication
  successMessage: string // Any success message from authentication
}

export interface FormValidation {
  isValid: boolean                    // Whether the form data is valid
  errors: Record<string, string>      // Map of field names to error messages
}

// Hook Return Types
// This type defines what the useAuthForm hook returns
export interface UseAuthFormReturn extends AuthState {
  // State setters
  setLoading: (loading: boolean) => void    // Function to update loading state
  setError: (error: string) => void         // Function to update error message
  setSuccess: (message: string) => void     // Function to update success message
  
  // Action handlers
  resetMessages: () => void                 // Function to clear all messages
  handleAuthError: (error: unknown) => void // Function to handle authentication errors
  handleAuthSuccess: () => void             // Function to handle successful authentication
}

// Constants
// These are the messages and timing values used throughout authentication
export const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
  },
} as const

export const REDIRECT_DELAY = 2000 // milliseconds - time to wait before redirecting after successful login 