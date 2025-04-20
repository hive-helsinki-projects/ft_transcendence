import { useState } from 'react'
import { AUTH_MESSAGES } from '../types/auth'

interface UseAuthFormReturn {
  isLoading: boolean
  error: string
  successMessage: string
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  setSuccess: (message: string) => void
  resetMessages: () => void
  handleAuthError: (error: unknown) => void
  handleAuthSuccess: () => void
}

export const useAuthForm = (): UseAuthFormReturn => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const resetMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  const handleAuthError = (error: unknown) => {
    setError(
      error instanceof Error
        ? error.message
        : AUTH_MESSAGES.ERROR.DEFAULT
    )
  }

  const handleAuthSuccess = () => {
    setSuccessMessage(AUTH_MESSAGES.SUCCESS)
  }

  return {
    isLoading,
    error,
    successMessage,
    setLoading: setIsLoading,
    setError,
    setSuccess: setSuccessMessage,
    resetMessages,
    handleAuthError,
    handleAuthSuccess,
  }
} 