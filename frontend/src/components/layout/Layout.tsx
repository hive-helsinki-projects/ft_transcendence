import React from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components'
import { ErrorBoundary } from './ErrorBoundary'
import { LoadingState } from '../LoadingState'
import PongBackground from '../PongBackground'
import '@assets/styles/index.css'

interface LayoutProps {
  children: React.ReactNode
  className?: string
  isLoading?: boolean
  loadingText?: string
  errorFallback?: React.ReactNode
  showBackground?: boolean
}

/**
 * Layout Component
 * Provides the complete application structure including:
 * - Sidebar navigation
 * - Styled main container (with dark background, border radius, etc.)
 * - Optional loading states and error handling
 * - Automatic Pong background for landing page
 */
export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  isLoading = false,
  loadingText = 'Loading...',
  errorFallback,
  showBackground = false
}) => {
  const location = useLocation()
  
  // Automatically show background on landing page
  const shouldShowBackground = showBackground || location.pathname === '/'

  return (
    <ErrorBoundary fallback={errorFallback}>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <div className={`loading-container ${className}`}>
            {shouldShowBackground && <PongBackground />}
              {isLoading ? (
                <LoadingState message={loadingText} />
              ) : (
                children
              )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
