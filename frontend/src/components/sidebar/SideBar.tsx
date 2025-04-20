import { useState } from 'react'
import { SidebarItem, menuItems } from '..'
import { type MenuItem } from './SidebarItem'
import '../../css'

/**
 * A vertical navigation bar with icons
 * Each icon represents a different section of the application
 */
const Sidebar = () => {
  // Track currently selected menu item
  const [selected, setSelected] = useState('home')

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      {menuItems.map((item: MenuItem) => (
        <SidebarItem
          key={item.id}
          id={item.id}
          icon={item.icon}
          path={item.path}
          isSelected={selected === item.id}
          onClick={setSelected}
        />
      ))}
    </nav>
  )
}

export default Sidebar
