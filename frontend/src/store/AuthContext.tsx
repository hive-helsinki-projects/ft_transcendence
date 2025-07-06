import React, { createContext, useEffect, useState } from 'react'
import { BaseService } from '@services/baseService'

interface AuthContextType {
  token: string | null
  username: string | null
  id: string | null
  isAuthenticated: boolean
  login: (token: string, username: string, id: string) => void
  logout: () => void
  isValidating: boolean
}

// AuthContext.tsx - This is like a wallet for your JWT token
const AuthContext = createContext<AuthContextType | null>(null)

export { AuthContext }

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Store the token (like putting it in your wallet)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  )
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem('username'),
  )
  const [id, setId] = useState<string | null>(localStorage.getItem('id'))
  // Check if you're logged in (do you have a valid token?)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isValidating, setIsValidating] = useState<boolean>(!!token)

  // Validate token by making a simple API call
  const validateToken = async () => {
    if (!token) {
      setIsValidating(false)
      return
    }

    try {
      // Make a simple API call to validate token
      // Using /players endpoint as it requires authentication
      await BaseService.get('/players')
      setIsAuthenticated(true)
    } catch {
      // Token is invalid, log out user
      // The axiosAgent interceptor will handle the redirect
      logout()
    } finally {
      setIsValidating(false)
    }
  }

  // Validate token on app load
  useEffect(() => {
    validateToken()
  }, []) // Only run once on mount

  // Update authentication state when token changes
  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false)
      setIsValidating(false)
    }
  }, [token])

  // Function to log in (put token in wallet)
  const login = (newToken: string, newUsername: string, newId: string) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
    localStorage.setItem('id', newId)
    setToken(newToken)
    setUsername(newUsername)
    setId(newId)
    setIsAuthenticated(true)
    setIsValidating(false)
  }

  // Function to log out (remove token from wallet)
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('id')
    setToken(null)
    setUsername(null)
    setId(null)
    setIsAuthenticated(false)
    setIsValidating(false)
  }

  return (
    <AuthContext.Provider
      value={{ token, username, id, isAuthenticated, login, logout, isValidating }}
    >
      {children}
    </AuthContext.Provider>
  )
}
