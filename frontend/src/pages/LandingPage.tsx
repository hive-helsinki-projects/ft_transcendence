import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingContainer from '../components/LoadingContainer'
import { useAuth } from '../hooks/useAuth'
import { localAuth } from '../services/localAuth'
import '../css/LandingPage.css'

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
        />
      </div>

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
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

const AuthSection: React.FC<{
  onGoogleAuth: () => void
  onNavigateToRegister: () => void
  children: React.ReactNode
}> = ({ onGoogleAuth, onNavigateToRegister, children }) => (
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleAuthSubmit = async (formData: FormData) => {
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields')
        return
      }

      const response = await localAuth.login(
        formData.username,
        formData.password,
      )
      setSuccessMessage('Login successful! Redirecting to dashboard...')

      await new Promise((resolve) => setTimeout(resolve, 2000))
      login(response.token, response.username)
      navigate('/dashboard')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Login failed. Please try again.',
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
