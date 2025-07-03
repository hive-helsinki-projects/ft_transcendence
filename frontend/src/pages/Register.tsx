import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContainer, AuthSection } from '../components/index'
import { useRegisterForm } from '@hooks/index'
import AuthForm from '../components/features/auth/AuthForm'
import { FormFieldConfig } from '@/types/auth'
import '../assets/styles/index.css'

const registerFields: FormFieldConfig[] = [
  { name: 'username', type: 'text', placeholder: 'Choose a username' },
  { name: 'email', type: 'email', placeholder: 'Enter your email' },
  { name: 'password', type: 'password', placeholder: 'Create a password' },
  { name: 'confirmPassword', type: 'password', placeholder: 'Confirm your password' },
]

const Register: React.FC = () => {
  const navigate = useNavigate()
  const {
    error,
    successMessage,
    isLoading,
    handleSubmit,
  } = useRegisterForm()

  const handleGoogleAuth = () => {
    // Handle Google Auth
  }

  return (
    <LoadingContainer>
      <div className="register-content">
        <AuthSection
          onGoogleAuth={handleGoogleAuth}
          onNavigateToRegister={() => navigate('/')}
        >
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

export default Register
