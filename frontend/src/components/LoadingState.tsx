import React from 'react'
import '../assets/styles/index.css'

interface LoadingStateProps {
  message?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  )
}
