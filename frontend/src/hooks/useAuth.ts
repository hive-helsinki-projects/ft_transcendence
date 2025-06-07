import { useContext } from 'react'
import { AuthContext } from '@/services'

/**
 * Custom hook for accessing the authentication context
 * 
 * This hook provides access to the authentication context, which contains
 * user authentication state and methods.
 */

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
};

export default useAuth