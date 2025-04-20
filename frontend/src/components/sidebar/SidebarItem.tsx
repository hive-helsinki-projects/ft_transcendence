import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  HelpCircle,
  Home,
  Settings,
  Trophy,
  User,
} from 'lucide-react'

// Types
export type MenuItem = {
  id: string
  icon: LucideIcon
  path: string
}

// Configuration
export const menuItems: MenuItem[] = [
  { id: 'home', icon: Home, path: '/' },
  { id: 'user', icon: User, path: '/dashboard' },
  { id: 'game', icon: Gamepad2, path: '/game' },
  { id: 'trophy', icon: Trophy, path: '/tournament' },
  { id: 'settings', icon: Settings, path: '/settings' },
  { id: 'help', icon: HelpCircle, path: '/help' },
]

// Component Props
type SidebarItemProps = {
  id: string
  icon: LucideIcon
  path: string
  isSelected: boolean
  onClick: (id: string) => void
}

/**
 * SidebarItem Component
 * 
 * Represents a single navigation item in the sidebar
 * Handles the rendering and interaction of individual menu items
 */
const SidebarItem = ({ id, icon: Icon, path, isSelected, onClick }: SidebarItemProps) => {
  return (
    <Link 
      to={path} 
      onClick={() => onClick(id)}
      className="sidebar-link"
    >
      <button
        type="button"
        aria-label={id}
        className={`sidebar-button ${isSelected ? 'selected' : ''}`}
      >
        <Icon size={24} />
      </button>
    </Link>
  )
}

export default SidebarItem 