import React, { createContext, useEffect, useState, useContext } from 'react'

interface AuthContextType {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  login: (token: string, username: string) => void
  logout: () => void
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
  // Check if you're logged in (do you have a valid token?)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

  useEffect(() => {
    setIsAuthenticated(!!token)
  }, [token])

  // Function to log in (put token in wallet)
  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  // Function to log out (remove token from wallet)
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
