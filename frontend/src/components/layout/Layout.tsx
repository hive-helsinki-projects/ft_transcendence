import React from 'react'
import Sidebar from '../pages/SideBar'

/**
 * Layout Component
 * This component provides the basic structure for the application
 * It includes a sidebar and a main content area
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default Layout 