import { AuthFormData } from '@/types/auth'
import { useAuth } from '@hooks/auth/useAuth'
import { AuthService } from '@services/authService'
import { validateRegistrationForm } from '@utils/validation'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslate } from '@hooks/index'
import { formatErrorMessage } from '@/utils/errors'

interface UseRegisterFormReturn {
  formData: AuthFormData
  error: string
  successMessage: string
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (formData: AuthFormData) => Promise<void>
}

export const useRegisterForm = (): UseRegisterFormReturn => {
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
  const { login } = useAuth()
  const t = useTranslate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (formData: AuthFormData): Promise<void> => {
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // Validate form data
      const { isValid, error: validationError } =
        validateRegistrationForm(formData)
      if (!isValid && validationError) {
        throw new Error(validationError)
      }

      // Register and login user
      const loginResponse = await AuthService.registerAndLogin(formData)

      // Update auth context
      login(loginResponse.token, loginResponse.username, loginResponse.id)

      // Show success message and redirect
      setSuccessMessage(t('Registration.successful'))
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (error) {
      setError(formatErrorMessage(error, t))
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
