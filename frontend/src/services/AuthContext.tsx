import React, { createContext, useContext, useEffect, useState } from 'react'
import { TokenService } from './tokenService'

interface AuthContextType {
  token: string | null
  username: string | null
  id: string | null
  isAuthenticated: boolean
  login: (token: string, username: string, id: string) => void
  logout: () => void
}

// AuthContext.tsx - This is like a wallet for your JWT token
const AuthContext = createContext<AuthContextType | null>(null)

export { AuthContext }

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Store the token (like putting it in your wallet)
  const [token, setToken] = useState<string | null>(TokenService.getToken())
  const [username, setUsername] = useState<string | null>(
    TokenService.getUsername(),
  )
  const [id, setId] = useState<string | null>(TokenService.getId())
  // Check if you're logged in (do you have a valid token?)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

  useEffect(() => {
    setIsAuthenticated(!!token)
  }, [token])

  // Function to log in (put token in wallet)
  const login = (newToken: string, newUsername: string, newId: string) => {
    TokenService.setTokenData(newToken, newUsername, newId)
    setToken(newToken)
    setUsername(newUsername)
    setId(newId)
  }

  // Function to log out (remove token from wallet)
  const logout = () => {
    TokenService.clearTokenData()
    setToken(null)
    setUsername(null)
    setId(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, username, id, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider }
