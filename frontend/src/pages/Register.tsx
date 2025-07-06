import { FormFieldConfig } from '@/types/auth'
import { useRegisterForm } from '@hooks/index'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthForm } from '@components/features/auth/AuthForm'
import { AuthSection, LoadingContainer } from '@components/index'

const registerFields: FormFieldConfig[] = [
  { name: 'username', type: 'text', placeholder: 'Choose a username' },
  { name: 'email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', type: 'password', placeholder: 'Create a password' },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
  },
]

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { error, successMessage, isLoading, handleSubmit } = useRegisterForm()

  return (
    <LoadingContainer>
      <div className="register-content">
        <AuthSection onNavigateToSignIn={() => navigate('/')}>
          <AuthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
            fields={registerFields}
          />
        </AuthSection>
      </div>
    </LoadingContainer>
  )
}
