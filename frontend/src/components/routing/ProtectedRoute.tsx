import { useAuth } from '@hooks/auth/useAuth'
import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute Component
 * This component ensures that only authenticated users can access certain routes
 * If the user is not authenticated, they will be redirected to the home page
 * Note: Loading state is handled at the AppRoutes level during token validation
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth()
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  
  return <>{children}</>
}
