import React from 'react'
import { useErrorHandler } from '@hooks/index'
import { LoadingState } from './LoadingState'
import { StatusMessage } from './features/auth/StatusMessage'

/**
 * Example component showing how to use useErrorHandler with LoadingState
 * This demonstrates the clean pattern of combining loading and error states
 */
export const AsyncComponentExample: React.FC = () => {
  const { error, isLoading, setLoading, handleError, clearError } = useErrorHandler()

  const handleApiCall = async () => {
    setLoading(true) // This clears any existing error and sets loading
    
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve("Success!") : reject(new Error("API call failed"))
        }, 2000)
      })
      
      setLoading(false) // Success - stop loading
    } catch (error) {
      handleError(error) // This stops loading and sets error
    }
  }

  // Render loading state
  if (isLoading) {
    return <LoadingState message="Fetching data..." />
  }

  return (
    <div className="p-4">
      <h2>Example: useErrorHandler + LoadingState</h2>
      
      {/* Error display */}
      {error && (
        <StatusMessage 
          type="error" 
          message={error} 
        />
      )}
      
      {/* Action button */}
      <button 
        onClick={handleApiCall}
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Make API Call'}
      </button>
      
      {/* Clear error button */}
      {error && (
        <button 
          onClick={clearError}
          className="btn-secondary ml-2"
        >
          Clear Error
        </button>
      )}
    </div>
  )
} 