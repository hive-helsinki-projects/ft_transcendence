import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User } from '@/services/localAuth'
import { useTranslate } from '@/hooks/useTranslate'

interface RegisterFormProps {
  onSubmit: SubmitHandler<RegisterFormInputs>
  isLoading: boolean
  successMessage: string
  onShowUsers: () => void
  registeredUsers: User[]
}

interface RegisterFormInputs {
  username: string
  email: string
  password: string
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
  successMessage,
}) => {
  const navigate = useNavigate()
  const t = useTranslate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>()

  return (
    <div className="register-container">
      <h1>{t('auth.register')}</h1>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">{t('auth.username')}</label>
          <input
            id="username"
            type="text"
            {...register('username', { required: t('auth.usernameRequired') })}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('auth.email')}</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: t('auth.emailRequired') })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('auth.password')}</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: t('auth.passwordRequired') })}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading ? t('auth.registering') : t('auth.register')}
        </button>
      </form>

      <div className="action-links">
        <p>
          {t('auth.alreadyHaveAccount')}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="link-button"
          >
            {t('auth.signInHere')}
          </button>
        </p>
      </div>
    </div>
  )
}
