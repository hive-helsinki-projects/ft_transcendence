import React from 'react'
import { useTranslate } from '@hooks/index'
import { API_URL } from '@utils/constants'
import type { UserPlayer } from '@/types/dashboard'
import '@assets/styles/Profile.css'

interface PlayerCardProps {
  player: UserPlayer
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const t = useTranslate()

  return (
    <div className="player-card">
      <img
        src={player.avatar ? `${API_URL}${player.avatar}` : '/placeholder-avatar1.png'}
        alt={player.display_name}
        className="player-avatar"
      />
      <p>{player.display_name}</p>
      <p>{t('Wins')}: {player.wins || 0}</p>
      <p>{t('Losses')}: {player.losses || 0}</p>
    </div>
  )
}
