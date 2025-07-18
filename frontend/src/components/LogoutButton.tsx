import { LogOut } from 'lucide-react'
import React, { useState } from 'react'
import '../assets/styles/index.css'
import { useTranslate } from '@/hooks/useTranslate'

interface LogoutButtonProps {
  onLogout: () => Promise<void>
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const t = useTranslate()
  
  const handleLogoutClick = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      // Auto-hide after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000)
    } else {
      await onLogout()
    }
  }

  return (
    <div className="logout-container">
      <button
        className={`btn-primary ${showConfirm ? 'confirm' : ''}`}
        onClick={handleLogoutClick}
        onMouseLeave={() => setShowConfirm(false)}
      >
        <LogOut size={18} />
        <span>{showConfirm ? t('auth.clickAgainToConfirm') : t('auth.logout')}</span>
      </button>
    </div>
  )
}
