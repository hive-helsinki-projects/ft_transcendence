import { useState } from 'react'
import { AUTH_MESSAGES, UseAuthFormReturn } from '../../types/auth'

/**
 * Custom hook for managing authentication form state and actions
 * 
 * This hook provides a complete solution for handling authentication form state,
 * including loading states, error messages, and success messages.
 * 
 * @returns {UseAuthFormReturn} An object containing:
 *   - State values (isLoading, error, successMessage)
 *   - State setters (setLoading, setError, setSuccess)
 *   - Action handlers (resetMessages, handleAuthError, handleAuthSuccess)
 * 
 * @example
 * const { isLoading, error, handleAuthError } = useAuthForm();
 * // Use these values and functions in your authentication form component
 */
export const useAuthForm = (): UseAuthFormReturn => {
  // Initialize state variables
  const [isLoading, setIsLoading] = useState(false)        // Tracks if authentication is in progress
  const [error, setError] = useState('')                   // Stores any error messages
  const [successMessage, setSuccessMessage] = useState('') // Stores success messages

  /**
   * Clears all messages (error and success)
   * Useful when starting a new authentication attempt
   */
  const resetMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  /**
   * Handles authentication errors
   * @param error - The error that occurred during authentication
   * If the error is an Error object, uses its message
   * Otherwise, uses the default error message
   */
  const handleAuthError = (error: unknown) => {
    setError(
      error instanceof Error
        ? error.message
        : AUTH_MESSAGES.ERROR.DEFAULT
    )
  }

  /**
   * Handles successful authentication
   * Sets the success message that will be displayed to the user
   */
  const handleAuthSuccess = () => {
    setSuccessMessage(AUTH_MESSAGES.SUCCESS)
  }

  // Return all state values and functions needed for authentication
  return {
    // State values
    isLoading,
    error,
    successMessage,
    
    // State setters
    setLoading: setIsLoading,
    setError,
    setSuccess: setSuccessMessage,
    
    // Action handlers
    resetMessages,
    handleAuthError,
    handleAuthSuccess,
  }
} 