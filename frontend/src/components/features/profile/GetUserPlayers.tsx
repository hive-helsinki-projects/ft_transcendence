import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PlayerCard } from './PlayerCard'

interface Player {
  id: number;
  display_name: string;
  wins: number;
  losses: number;
  avatar_url: string;
  created_at: string;
}

interface GetUserPlayersProps {
  userId: number;
}


export const GetUserPlayers: React.FC<GetUserPlayersProps> = ({ userId }) => {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get<Player[]>(
          `https://localhost:3001/users/${userId}/players`,
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
    <div>
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  )
}
