import PongBackground from '@components/PongBackground'
import React from 'react'
import '../assets/styles/index.css'

interface LoadingContainerProps {
  children: React.ReactNode
  showPongBackground?: boolean
}

export const LoadingContainer: React.FC<LoadingContainerProps> = ({
  children,
  showPongBackground = false,
}) => {
  return (
    <div className="loading-container">
      {showPongBackground && <PongBackground />}
      <div className="content-wrapper">{children}</div>
    </div>
  )
}
