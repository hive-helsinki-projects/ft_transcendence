import { useState } from 'react'
import { SidebarItem, menuItems, MenuItem } from '..'
import '../../assets/styles/index.css'

/**
 * Sidebar Component
 * 
 * A vertical navigation bar that displays menu items as icons
 * Allows users to navigate between different sections of the application
 */
const Sidebar = () => {
  // Initialize state to track which menu item is currently selected
  // 'home' is set as the default selected item
  const [selected, setSelected] = useState('home')
  
  return (
    // Navigation container with sidebar styling
    <nav className="sidebar">
      {/* Map through menuItems array to create SidebarItem components */}
      {menuItems.map((item: MenuItem) => (
        <SidebarItem
          key={item.id}          // Unique identifier for each item
          id={item.id}           // Item identifier
          icon={item.icon}       // Icon component to display
          path={item.path}       // Navigation path
          isSelected={selected === item.id}  // Check if this item is currently selected
          onClick={setSelected}  // Function to update selected item
        />
      ))}
    </nav>
  )
}

export default Sidebar
