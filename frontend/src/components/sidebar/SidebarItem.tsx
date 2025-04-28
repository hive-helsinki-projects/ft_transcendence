import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

// Types
export type MenuItem = {
  id: string
  icon: LucideIcon
  path: string
}

// Component Props
type SidebarItemProps = MenuItem & {
  isSelected: boolean;
  onClick: (id: string) => void;
};

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