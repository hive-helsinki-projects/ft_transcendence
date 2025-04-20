import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingContainer from '../components/LoadingContainer'
import { useAuth } from '../hooks/useAuth'
import { localAuth } from '../services/localAuth'
import '../css/LandingPage.css'

// Constants
const AUTH_MESSAGES = {
  SUCCESS: 'Login successful! Redirecting to dashboard...',
  ERROR: {
    REQUIRED_FIELDS: 'Please fill in all fields',
    DEFAULT: 'Login failed. Please try again.',
  },
  BUTTON: {
    SIGN_IN: 'Sign In',
    SIGNING_IN: 'Signing in...',
  },
} as const

const REDIRECT_DELAY = 2000

// Types
interface FormData {
  username: string
  password: string
}

interface AuthFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  isLoading: boolean
  error: string
  successMessage: string
}

interface AuthSectionProps {
  onGoogleAuth: () => void
  onNavigateToRegister: () => void
  children: React.ReactNode
}

// Custom Hook
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

// Components
const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading,
  error,
  successMessage,
}) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="form-group">
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9]+"
          title="Username must contain only letters and numbers"
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleInputChange}
          disabled={isLoading}
          required
          minLength={6}
          title="Password must be at least 6 characters long"
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? AUTH_MESSAGES.BUTTON.SIGNING_IN : AUTH_MESSAGES.BUTTON.SIGN_IN}
      </button>
    </form>
  )
}

const HeroSection: React.FC = () => (
  <section className="hero-section">
    <h1>Ping. Pong. Play!</h1>
    <h2>Level Up Your Ping Pong Skills</h2>
    <p>
      Smash, spin, and dominate the table. Prove you're the ultimate paddle
      master.
    </p>
  </section>
)

const AuthSection: React.FC<AuthSectionProps> = ({
  onGoogleAuth,
  onNavigateToRegister,
  children,
}) => (
  <section className="auth-section">
    <h2>Let's Play!</h2>
    {children}
    <div className="auth-options">
      <div className="google-auth">
        <span>Or</span>
        <button
          type="button"
          className="google-button"
          onClick={onGoogleAuth}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width="20"
            height="20"
          />
          Sign in with Google
        </button>
      </div>

      <div className="register-link">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onNavigateToRegister}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  </section>
)

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
      if (!formData.username || !formData.password) {
        setError(AUTH_MESSAGES.ERROR.REQUIRED_FIELDS)
        return
      }

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
