import React from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components'
import { ErrorBoundary } from './ErrorBoundary'
import { Footer } from './Footer'
import { LoadingState } from '../LoadingState'
import PongBackground from '../PongBackground'
import { AvatarMenu } from '@/components/features/dashboard'
import { useAuth } from '@/hooks/auth/useAuth'
import { useAvatar } from '@/hooks/index'
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
 * - Footer
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
  const { id: userId, logout } = useAuth()
  const parsedId = userId ? parseInt(userId, 10) : null
  const { avatar, handleAvatarChange } = useAvatar(parsedId)
  
  // Automatically show background on landing page
  const shouldShowBackground = showBackground || location.pathname === '/'
  
  // Show sidebar on all pages except public pages (landing, register)
  const shouldShowSidebar = !['/register', '/'].includes(location.pathname)

  return (
    <ErrorBoundary fallback={errorFallback}>
      <div className="app-layout">
        {shouldShowSidebar && <Sidebar />}
        {shouldShowSidebar && (
          <AvatarMenu
            avatar={avatar}
            onAvatarChange={handleAvatarChange}
            onLogout={logout}
          />
        )}
        <div className={`layout-content ${shouldShowSidebar ? 'with-sidebar' : ''}`}>
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
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  )
}
