import React from 'react'
import { AuthSectionProps } from '@/types/auth'
import '@assets/styles/index.css'
import { GoogleSignIn } from '@components/GoogleSignIn'
import { useAuthForm } from '@hooks/index'
import { useTranslate } from '@/hooks/useTranslate'

export const AuthSection: React.FC<AuthSectionProps> = ({
  onNavigateToRegister,
  onNavigateToSignIn,
  children,
}) => {
  const { isLoading } = useAuthForm()
  const t = useTranslate()

  return (
    <section className="auth-section">
    <h2>{t('auth.title')}</h2>
    {children}
    <div className="auth-options">
      <div className="google-auth">
        <span>Or</span>
        <GoogleSignIn isLoading={isLoading}/>
      </div>

      {onNavigateToRegister && (
        <div className="register-link">
          <p>
            {t('auth.dontHaveAccount')}
            <button
              type="button"
              className="link-button"
              onClick={onNavigateToRegister}
              aria-label="Register new account"
            >
              {t('auth.registerHere')}
            </button>
          </p>
        </div>
      )}

      {onNavigateToSignIn && (
        <div className="register-link">
          <p>
            {t('auth.alreadyHaveAccount')}
            <button
              type="button"
              className="link-button"
              onClick={onNavigateToSignIn}
              aria-label="Sign in to account"
            >
              {t('auth.signInHere')}
            </button>
          </p>
        </div>
      )}
    </div>
  </section>
  )
}


