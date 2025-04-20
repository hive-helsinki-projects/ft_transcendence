import { useState } from 'react'
import { SidebarItem, menuItems } from '../components'
import '../css/Sidebar.css'

/**
 * Sidebar Component
 * 
 * A navigation component that displays a vertical menu of icons
 * Each icon represents a different section of the application
 * 
 * Features:
 * - Visual icons for easy navigation
 * - Selected state highlighting
 * - Responsive design with CSS
 */
const Sidebar = () => {
  // State to track which menu item is currently selected
  const [selected, setSelected] = useState<string>('home')

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      {menuItems.map(({ id, icon, path }) => (
        <SidebarItem
          key={id}
          id={id}
          icon={icon}
          path={path}
          isSelected={selected === id}
          onClick={setSelected}
        />
      ))}
    </nav>
  )
}

export default Sidebar
