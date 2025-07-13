import { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import React from 'react'
import i18n from '@i18n/config'

// Types
export type MenuItem = {
  id: string
  icon: LucideIcon
  path: string
}

// Component Props
type SidebarItemProps = MenuItem & {
  isSelected: boolean
  onClick: (id: string) => void
}

/**
 * SidebarItem Component
 *
 * Represents a single navigation item in the sidebar
 * Handles the rendering and interaction of individual menu items
 * Special handling for language buttons
 */
export const SidebarItem = ({
  id,
  icon: Icon,
  path,
  isSelected,
  onClick,
}: SidebarItemProps) => {
  // Language change logic
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  // Special handling for language buttons
  if (id.startsWith('lang-')) {
    const langCode = id.replace('lang-', '')
    
    return (
      <button
        type="button"
        className={`sidebar-button ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          changeLanguage(langCode)
          onClick(id)
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {langCode.toUpperCase()}
        </span>
      </button>
    )
  }

  // Regular navigation items
  return (
    <Link to={path} onClick={() => onClick(id)} className="sidebar-link">
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
