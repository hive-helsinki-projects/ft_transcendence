import React from 'react'
import { SideBar } from '..'

/**
 * Layout Component
 * This component provides the basic structure for the application
 * It includes a sidebar and a main content area
 */
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <SideBar />
      <div className="main-content">{children}</div>
    </div>
  )
}
