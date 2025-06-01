import React, { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  login: (token: string, username: string, id?: number) => void
  logout: () => void
  user: {
    token: string
    username: string
    id?: number
  } | null
  isAuthenticated: boolean
}

// AuthContext.tsx - This is like a wallet for your JWT token
export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  user: null,
  isAuthenticated: false,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const isAuthenticated = !!user

  useEffect(() => {
    setUser(user)
  }, [user])

  // Function to log in (put token in wallet)
  const login = (token: string, username: string, id?: number) => {
    setUser({ token, username, id })
  }

  // Function to log out (remove token from wallet)
  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isAuthenticated }}>
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
