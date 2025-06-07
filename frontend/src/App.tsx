import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRoutes, Layout } from './components'
import { AuthProvider } from './services/AuthContext'

/**
 * Main App Component
 * This is the root component of the application
 * It wraps everything with the AuthProvider for authentication
 * and Router for navigation
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
