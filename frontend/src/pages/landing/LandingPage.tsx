import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContainer, AuthForm, AuthSection, HeroSection } from '../../components/index'
import { useAuth } from '../../hooks/auth/useAuth'
import { useAuthForm } from '../../hooks/auth/useAuthForm'
import { AuthService } from '../../services/authService'
import { AuthFormData, REDIRECT_DELAY } from '../../types/auth'
import { LoginResponse } from '../../services/authService'

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

  const [needs2fa, setNeeds2fa] = React.useState(false)
  const [userId, setUserId] = React.useState<number | null>(null)
  const [twoFaCode, setTwoFaCode] = React.useState('')
  const [twoFaError, setTwoFaError] = React.useState('')
  const [cachedUsername, setCachedUsername] = React.useState('')

  // Handlers
  const handleAuthSubmit = async (formData: AuthFormData) => {
    resetMessages()
    setLoading(true)

    try {
      const response = await AuthService.login(formData)
    
      if ('userId' in response && response.message === 'Two-factor authentication required') {
        setNeeds2fa(true)
        setUserId(response.userId)
        setCachedUsername(formData.username)
        return
      }

      const loginResponse = response as LoginResponse
    
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(loginResponse.token, loginResponse.username)
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

  const handleVerify2FA = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { token } = await AuthService.login2fa(userId, twoFaCode)
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(token, cachedUsername)
      navigate('/dashboard')
    } catch (err) {
      setTwoFaError('Invalid 2FA code')
    } finally {
      setLoading(false)
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
        {needs2fa && (
          <div className="modal">
            <h3>Two-Factor Authentication</h3>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value)}
              maxLength={6}
              className="field-input"
            />
            <button className="save-button" onClick={handleVerify2FA} disabled={isLoading}>
              Verify
            </button>
            {twoFaError && <p className="error-message">{twoFaError}</p>}
          </div>
        )}
        </AuthSection>
    </LoadingContainer>
  )
}

export default LandingPage
