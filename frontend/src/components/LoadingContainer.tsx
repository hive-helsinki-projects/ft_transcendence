import React from 'react'
import PongBackground from './PongBackground'
import '../assets/styles/index.css'

interface LoadingContainerProps {
  children: React.ReactNode
  showPongBackground?: boolean
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({
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

export default LoadingContainer
