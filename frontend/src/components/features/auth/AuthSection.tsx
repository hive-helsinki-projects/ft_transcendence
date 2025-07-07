import React from 'react'
import { AuthSectionProps } from '@/types/auth'
import '@assets/styles/index.css'
import { GoogleSignIn } from '@components/GoogleSignIn'

export const AuthSection: React.FC<AuthSectionProps> = ({
  onNavigateToRegister,
  onNavigateToSignIn,
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

      {onNavigateToRegister && (
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
      )}

      {onNavigateToSignIn && (
        <div className="register-link">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onNavigateToSignIn}
              aria-label="Sign in to account"
            >
              Sign in here
            </button>
          </p>
        </div>
      )}
    </div>
  </section>
  )
}


