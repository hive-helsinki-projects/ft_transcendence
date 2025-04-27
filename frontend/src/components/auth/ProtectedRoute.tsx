import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { username } = useAuth()

  if (!username) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 