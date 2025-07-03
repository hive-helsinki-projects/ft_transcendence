import {
  Gamepad2,
  HelpCircle,
  Home,
  Settings,
  Trophy,
  User,
} from 'lucide-react'
import { type MenuItem } from './SidebarItem'

const id = localStorage.getItem('id')

// Configuration
export const menuItems: MenuItem[] = [
  { id: 'home', icon: Home, path: '/' },
  { id: 'user', icon: User, path: `/profile/${id}` },
  { id: 'game', icon: Gamepad2, path: '/game' },
  { id: 'trophy', icon: Trophy, path: '/tournament' },
  { id: 'settings', icon: Settings, path: '/settings' },
  { id: 'help', icon: HelpCircle, path: '/help' },
]
