import { ErrorBoundary } from '@/components/common'
import { AuthProvider } from '@/app'
import { I18nProvider } from '@/shared/providers/I18nProvider'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * Centralized providers component
 * All global providers and context are configured here
 */
const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <Router>{children}</Router>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default AppProviders
