import React, { Component, ErrorInfo, ReactNode } from 'react'

/**
 * A versatile error boundary component that displays:
 * - Error messages
 * - Fallback UI
 * - Usage in various UI contexts (error pages, error handling, error boundaries)
 */

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-medium text-red-600">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please try refreshing the page
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
