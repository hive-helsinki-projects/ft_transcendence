import React from 'react'
import PongBackground from '@components/PongBackground'
import '@assets/styles/LoadingContainer.css'

interface LoadingContainerProps {
  children: React.ReactNode
  showBackground?: boolean
  className?: string
}

/**
 * LoadingContainer Component
 * Provides the main container layout with optional background
 * Focuses purely on layout structure, not loading states
 */
export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  children,
  showBackground = false,
  className = ''
}) => {
  return (
    <div className={`loading-container ${className}`}>
      {showBackground && <PongBackground />}
      {children}
    </div>
  )
}
