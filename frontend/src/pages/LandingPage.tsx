import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContainer, AuthForm, AuthSection, HeroSection } from '../components'
import { useAuth } from '../hooks/useAuth'
import { useAuthForm } from '../hooks/useAuthForm'
import { localAuth } from '../services/localAuth'
import { FormData } from '../types/auth'

// Constants
const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    DEFAULT: 'Login failed. Please try again.',
  },
} as const

const REDIRECT_DELAY = 2000

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const {
    isLoading,
    setIsLoading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    resetMessages,
  } = useAuthForm()

  const handleAuthSubmit = async (formData: FormData) => {
    resetMessages()
    setIsLoading(true)

    try {
      const response = await localAuth.login(
        formData.username,
        formData.password,
      )
      setSuccessMessage(AUTH_MESSAGES.SUCCESS)

      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(response.token, response.username)
      navigate('/dashboard')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : AUTH_MESSAGES.ERROR.DEFAULT,
      )
    } finally {
      setIsLoading(false)
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
