import { AppRoutes, Layout } from '@components/index'
import { AuthProvider } from '@store/AuthContext'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

/**
 * Main App Component
 * This is the root component of the application
 * It wraps everything with the AuthProvider for authentication
 * and Router for navigation
 */
export const App: React.FC = () => {
  return (
    <Router>
        <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
    </AuthProvider>
      </Router>
  )
}
