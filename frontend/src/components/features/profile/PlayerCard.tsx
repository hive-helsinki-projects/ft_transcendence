import React from 'react'
import { useTranslate } from '@hooks/index'
import { API_URL } from '@utils/constants'
import type { UserPlayer } from '@/types/dashboard'
import '@assets/styles/Profile.css'

interface PlayerCardProps {
  player: UserPlayer & { avatar_url?: string }
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const t = useTranslate()

  // Handle both avatar (from Dashboard) and avatar_url (from ProfilePage backend)
  const avatarUrl = player.avatar || player.avatar_url || '/placeholder-avatar1.png'
  const fullAvatarUrl = avatarUrl.startsWith('http') ? avatarUrl : `${API_URL}${avatarUrl}`

  return (
    <div className="player-card">
      <img
        src={fullAvatarUrl}
        alt={player.display_name}
        className="player-avatar"
      />
      <p>{player.display_name}</p>
      <p>{t('Wins')}: {player.wins || 0}</p>
      <p>{t('Losses')}: {player.losses || 0}</p>
    </div>
  )
}
