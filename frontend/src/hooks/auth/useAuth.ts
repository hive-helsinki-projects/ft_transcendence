import { useContext } from 'react'
import { AuthContext } from '../../store/AuthContext'

/**
 * Custom hook for accessing the authentication context
 * 
 * This hook provides access to the authentication context, which contains
 * user authentication state and methods.
 */

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
