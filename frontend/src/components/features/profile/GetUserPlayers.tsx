import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PlayerCard } from './PlayerCard'

export const GetUserPlayers = ({ userId }) => {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
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
