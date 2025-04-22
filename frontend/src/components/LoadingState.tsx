import React from 'react'
import '../assets/styles/index.css'

interface LoadingStateProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  return (
    <div className={`loading-state ${size}`} role="status" aria-live="polite">
      <div className="loading-spinner" />
      <span className="loading-message">{message}</span>
    </div>
  )
}

export default LoadingState 