import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PlayerCard } from './PlayerCard'
import { useTranslate } from '@/hooks/useTranslate'
import { API_URL } from '@utils/constants'
import type { UserPlayer } from '@/types/dashboard'
import '@assets/styles/Profile.css'

interface GetUserPlayersProps {
  userId: string | number
}

export const GetUserPlayers: React.FC<GetUserPlayersProps> = ({ userId }) => {
  const [players, setPlayers] = useState<UserPlayer[]>([])
  const t = useTranslate()

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/users/${userId}/players`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        console.log('Fetched players:', response.data)
        setPlayers(response.data || [])
      } catch (error) {
        console.error('Error fetching players:', error)
      }
    }
    fetchPlayers()
  }, [userId])

  return (
    <>
      <h2>{t('Players')}</h2>
      <div className="players-management">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
        {players.length === 0 && <p>{t('No players available.')}</p>}
      </div>
    </>
  )
}
