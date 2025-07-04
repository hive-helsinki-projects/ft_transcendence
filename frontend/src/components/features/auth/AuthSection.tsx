import React from 'react'
import { AuthSectionProps } from '../../../types/auth'
import '../../../assets/styles/index.css'
import GoogleSignIn from "../../GoogleSignIn";
import { useAuthForm } from '../../../hooks/auth/useAuthForm'

const AuthSection: React.FC<AuthSectionProps> = ({
  onGoogleAuth,
  onNavigateToRegister,
  children,
}) => {

  const { isLoading } = useAuthForm()
  console.log(`AuthSection: isLoding is ${isLoading}`);

  return (
    <section className="auth-section">
    <h2>Let's Play!</h2>
    {children}
    <div className="auth-options">
      <div className="google-auth">
        <span>Or</span>
          <GoogleSignIn isLoading={isLoading}/>
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
}

export default AuthSection
