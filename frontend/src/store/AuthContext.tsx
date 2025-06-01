import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Authentication context type definition
 */
interface AuthContextType {
  token: string | null
  username: string | null
  id: string | null
  isAuthenticated: boolean
  login: (token: string, username: string, id: string) => void
  logout: () => void
}

/**
 * Storage keys for authentication data
 */
const STORAGE_KEYS = {
  TOKEN: 'token',
  USERNAME: 'username',
  ID: 'id',
} as const

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Authentication provider component
 * Manages authentication state and provides authentication methods
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State management
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  )
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.USERNAME),
  )
  const [id, setId] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.ID),
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

  // Update authentication state when token changes
  useEffect(() => {
    setIsAuthenticated(!!token)
  }, [token])

  /**
   * Login function
   * Stores authentication data in localStorage and state
   */
  const login = (
    newToken: string,
    newUsername: string,
    newId: string,
  ): void => {
    // Store in localStorage
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
    localStorage.setItem(STORAGE_KEYS.USERNAME, newUsername)
    localStorage.setItem(STORAGE_KEYS.ID, newId)

    // Update state
    setToken(newToken)
    setUsername(newUsername)
    setId(newId)
  }

  /**
   * Logout function
   * Removes authentication data from localStorage and state
   */
  const logout = (): void => {
    // Remove from localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
    localStorage.removeItem(STORAGE_KEYS.ID)

    // Clear state
    setToken(null)
    setUsername(null)
    setId(null)
  }

  // Context value
  const contextValue: AuthContextType = {
    token,
    username,
    id,
    isAuthenticated,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

/**
 * Custom hook to use the authentication context
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }
