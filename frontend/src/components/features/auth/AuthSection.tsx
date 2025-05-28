import React from 'react'
import { AuthSectionProps } from '../../../types/auth'
import '../../../assets/styles/index.css'
import GoogleSignInNew from "../../../components/GoogleSignInNew";
import { useAuthForm } from '../../../hooks/auth/useAuthForm'

const AuthSection: React.FC<AuthSectionProps> = ({
  onGoogleAuth,
  onNavigateToRegister,
  children,
}) => (

    // const {
    //   isLoading
    // } = useAuthForm()
  
  <section className="auth-section">
    <h2>Let's Play!</h2>
    {children}
    <div className="auth-options">
      <div className="google-auth">
        <span>Or</span>
          <GoogleSignInNew />
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