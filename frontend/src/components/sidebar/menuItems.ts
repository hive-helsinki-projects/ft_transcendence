import {
  Gamepad2,
  HelpCircle,
  Home,
  Settings,
  Trophy,
  User,
} from 'lucide-react'
import { type MenuItem } from './SidebarItem'

// Configuration - now a function to get current user ID
export const getMenuItems = (): MenuItem[] => {
  const id = localStorage.getItem('id')
  
  return [
    { id: 'home', icon: Home, path: '/' },
    { id: 'user', icon: User, path: `/profile/${id}` },
    { id: 'game', icon: Gamepad2, path: '/game' },
    { id: 'trophy', icon: Trophy, path: '/tournament' },
    { id: 'settings', icon: Settings, path: '/settings' },
    { id: 'help', icon: HelpCircle, path: '/help' },
  ]
}

// Deprecated: Use getMenuItems() instead
export const menuItems = getMenuItems()
