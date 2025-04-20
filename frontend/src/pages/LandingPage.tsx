import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContainer, AuthForm, AuthSection, HeroSection } from '../components'
import { useAuth } from '../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'
import { AuthService } from '../services/authService'
import { AuthFormData, REDIRECT_DELAY } from '../types/auth'

const LandingPage: React.FC = () => {
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

  const handleGoogleAuth = () => {
    // TODO: Implement Google authentication
    console.log('Google auth clicked')
  }

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
