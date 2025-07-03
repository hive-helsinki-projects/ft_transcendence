import { useAuth } from '@hooks/auth/useAuth'
import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute Component
 * This component ensures that only authenticated users can access certain routes
 * If the user is not authenticated, they will be redirected to the home page
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  return <>{children}</>
}

export default ProtectedRoute
