import { useState } from 'react'

const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const resetMessages = () => {
    setError('')
    setSuccessMessage('')
  }

  return {
    isLoading,
    setIsLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    resetMessages,
  }
}

export { useAuthForm } 