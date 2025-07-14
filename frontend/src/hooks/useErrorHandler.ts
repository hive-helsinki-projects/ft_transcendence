import { useState } from "react"

export interface UseErrorHandlerReturn {
  error: string
  isLoading: boolean
  setLoading: (loading: boolean) => void
  handleError: (error: unknown) => void
  clearError: () => void
  clearAll: () => void
  hasError: boolean
}

// Universal error and loading hook for all components
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleError = (error: unknown) => {
    setError(error instanceof Error ? error.message : 'An error occurred')
    setIsLoading(false) // Stop loading when error occurs
  }

  const setLoading = (loading: boolean) => {
    if (loading) {
      setError('') // Clear error when starting new operation
    }
    setIsLoading(loading)
  }

  const clearError = () => setError('')
  
  const clearAll = () => {
    setError('')
    setIsLoading(false)
  }

  return { 
    error, 
    isLoading, 
    setLoading,
    handleError, 
    clearError,
    clearAll,
    hasError: !!error
  }
}