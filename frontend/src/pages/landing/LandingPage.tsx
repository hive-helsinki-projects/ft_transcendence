import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContainer, AuthForm, AuthSection, HeroSection } from '../../components/index'
import { useAuth } from '../../hooks/auth/useAuth'
import { useAuthForm } from '../../hooks/auth/useAuthForm'
import { AuthService } from '../../services/authService'
import { AuthFormData, REDIRECT_DELAY } from '../../types/auth'

/**
 * LandingPage Component
 * 
 * Main entry point for unauthenticated users.
 * Displays a hero section and authentication form.
 * Handles user login functionality and
 * navigation to dashboard upon successful authentication.
 */
const LandingPage: React.FC = () => {
  // Hooks
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    isLoading,
    error,
    successMessage,
    setLoading,
    resetMessages,
    handleAuthError,
    handleAuthSuccess,
  } = useAuthForm()

  // Handlers
  const handleAuthSubmit = async (formData: AuthFormData) => {
    resetMessages()
    setLoading(true)

    try {
      const response = await AuthService.login(formData)
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(response.token, response.username)
      navigate('/dashboard')
    } catch (error) {
      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const response = await AuthService.googleAuth()
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(response.token, response.username)
      navigate('/dashboard')
    } catch (error) {
      handleAuthError(error)
    }
  }

  // Render
  return (
    <LoadingContainer showPongBackground>
      <HeroSection />
      <AuthSection
        onGoogleAuth={handleGoogleAuth}
        onNavigateToRegister={() => navigate('/register')}
      >
        <AuthForm
          onSubmit={handleAuthSubmit}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
        />
        </AuthSection>
    </LoadingContainer>
  )
}

export default LandingPage
