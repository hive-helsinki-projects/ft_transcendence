import { AuthFormData } from '@/types/auth'
import { useAuth, useAuthForm } from '@hooks/index'
import { AuthService, LoginResponse } from '@services/authService'
import { REDIRECT_DELAY } from '@utils/constants'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AuthForm,
  AuthSection,
  HeroSection,
} from '@components/index'
import '@assets/styles/index.css'
import { useTranslate } from '@/hooks/useTranslate'
import { formatErrorMessage } from '@/utils/errors'

/**
 * LandingPage Component
 *
 * Main entry point for unauthenticated users.
 * Displays a hero section and authentication form.
 * Handles user login functionality and
 * navigation to dashboard upon successful authentication.
 */
export const LandingPage: React.FC = () => {
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
  const t = useTranslate()

  // State
  const [needs2fa, setNeeds2fa] = React.useState(false)
  const [userId, setUserId] = React.useState<number | null>(null)
  const [twoFaCode, setTwoFaCode] = React.useState('')
  const [twoFaError, setTwoFaError] = React.useState('')
  const [cachedUsername, setCachedUsername] = React.useState('')

  // Handlers
  const handleAuthSubmit = async (formData: AuthFormData) => {
    setLoading(true)

    try {
      const response = await AuthService.login(formData)

      if (
        'userId' in response &&
        response.message === 'Two-factor authentication required'
      ) {
        setNeeds2fa(true)
        setUserId(response.userId)
        setCachedUsername(formData.username)
        return
      }

      const loginResponse = response as LoginResponse

      resetMessages() // Only clear messages on successful login
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(loginResponse.token, loginResponse.username, loginResponse.id)
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
      console.log(response)
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      login(response.token, response.username, response.id)
      navigate('/dashboard')
    } catch (error) {
      handleAuthError(error)
    }
  }

  const handleVerify2FA = async () => {
    if (!userId) return
    setTwoFaError('')
    setLoading(true)
    try {
      const loginResponse = await AuthService.login2fa(userId, twoFaCode)
      handleAuthSuccess()
      await new Promise((resolve) => setTimeout(resolve, REDIRECT_DELAY))
      const finalUsername = loginResponse.username || cachedUsername
      login(loginResponse.token, finalUsername, loginResponse.id)
      navigate('/dashboard')
    } catch {
      setTwoFaError(formatErrorMessage(error, t))
    } finally {
      setLoading(false)
    }
  }

  // Render
  return (
    <div className="landing-content">
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
          buttonText={t('auth.signIn')}
          loadingText={t('auth.signingIn')}
        />
        {needs2fa && (
          <div className="modal">
            <h3>{t('Two-Factor Authentication')}</h3>
            <input
              type="text"
              placeholder={t('Enter 6-digit code')}
              value={twoFaCode}
              onChange={(e) => setTwoFaCode(e.target.value)}
              maxLength={6}
              className="field-input"
            />
            <button
              className="save-button"
              onClick={handleVerify2FA}
              disabled={isLoading}
            >
              {t('Verify')}
            </button>
            {twoFaError && <p className="error-message">{twoFaError}</p>}
          </div>
        )}
      </AuthSection>
    </div>
  )
}
