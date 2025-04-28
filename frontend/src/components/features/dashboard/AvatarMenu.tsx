import React from 'react'
import { LogOut, Pencil, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AvatarMenuProps {
  avatar: string
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onLogout: () => void
}

const AvatarMenu: React.FC<AvatarMenuProps> = ({
  avatar,
  onAvatarChange,
  onLogout,
}) => {
  const navigate = useNavigate()

  return (
    <div className="avatar-container">
      <img src={avatar} alt="User avatar" className="welcome-avatar" />
      <div className="online-status" />
      <div className="avatar-menu">
        <div className="settings-avatar-container">
          <img src={avatar} alt="User avatar" className="settings-avatar" />
          <button
            type="button"
            className="settings-edit-button"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            aria-label="Edit avatar"
          >
            <Pencil size={14} />
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            className="avatar-input"
            id="avatar-upload"
            aria-label="Upload profile picture"
            style={{ display: 'none' }}
          />
        </div>
        <button className="avatar-menu-button" onClick={() => navigate('/settings')}>
          <Settings size={16} />
          <span>Profile Settings</span>
        </button>
        <button className="avatar-menu-button logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default AvatarMenu 