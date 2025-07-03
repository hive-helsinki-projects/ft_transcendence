import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User } from '../services/localAuth'

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
  onShowUsers,
  registeredUsers,
}) => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>()

  return (
    <div className="register-container">
      <h1>Register</h1>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            {...register('username', { required: 'Username is required' })}
            disabled={isLoading}
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div className="action-links">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="link-button"
          >
            Login here
          </button>
        </p>
      </div>

      <div className="registered-users">
        <button
          type="button"
          onClick={onShowUsers}
          className="show-users-button"
        >
          Show Registered Users
        </button>
        {registeredUsers.length > 0 && (
          <div className="users-list">
            <h3>Registered Users:</h3>
            <ul>
              {registeredUsers.map((user, index) => (
                <li key={index}>
                  Username: {user.username}, Email: {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
