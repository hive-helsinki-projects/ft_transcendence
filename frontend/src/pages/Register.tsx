import { FormFieldConfig } from '@/types/auth'
import { useRegisterForm } from '@hooks/index'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from '@components/features/auth/AuthForm'
import { AuthSection } from '@components/index'
import { useTranslate } from '@/hooks/useTranslate'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { error, successMessage, isLoading, handleSubmit } = useRegisterForm()
  const t = useTranslate()

  const registerFields: FormFieldConfig[] = [
    { name: 'username', type: 'text', placeholder: t('auth.chooseAUsername') || 'Choose a username' },
    { name: 'email', type: 'email', placeholder: t('auth.enterEmail') || 'Enter your email' },
    { name: 'password', type: 'password', placeholder: t('auth.createAPassword') || 'Create a password' },
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: t('auth.confirmPassword') || 'Confirm your password',
    },
  ]
  return (
    <div className="register-content">
      <AuthSection onNavigateToSignIn={() => navigate('/')}>
        <AuthForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          successMessage={successMessage}
          fields={registerFields}
          buttonText={t('auth.register')}
          loadingText={t('auth.registering')}
        />
      </AuthSection>
    </div>
  )
}
