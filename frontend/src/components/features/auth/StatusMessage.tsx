import React from 'react'
import '../../../assets/styles/index.css'

interface StatusMessageProps {
  type: 'error' | 'success'
  message: string
}

/**
 * Reusable component for displaying status messages (errors or success)
 */
export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
}) => (
  <div className={`${type}-message`} role="alert">
    {message}
  </div>
)
