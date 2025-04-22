import React from 'react'
import { AuthSectionProps } from '../../../types/auth'
import '../../../assets/styles'

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
          aria-label="Sign in with Google"
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
            aria-label="Register new account"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  </section>
)

export default AuthSection 