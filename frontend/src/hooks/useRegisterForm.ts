import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthFormData } from '../types/auth'
import { localAuth } from '../services/localAuth'

export const useRegisterForm = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = (data: AuthFormData): string | null => {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      return 'Please fill in all fields'
    }

    if (data.password !== data.confirmPassword) {
      return 'Passwords do not match'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const handleSubmit = async (formData: AuthFormData) => {
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const validationError = validateForm(formData)
      if (validationError) {
        throw new Error(validationError)
      }

      const response = await localAuth.register(
        formData.username,
        formData.email || '',
        formData.password,
      )
      setSuccessMessage(response.message + ' Redirecting to login...')

      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formData,
    error,
    successMessage,
    isLoading,
    handleInputChange,
    handleSubmit,
  }
} 