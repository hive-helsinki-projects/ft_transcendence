import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const PlayerName = ({ id }: { id: string }) => {
  const [playerName, setPlayerName] = useState<string>('')

  useEffect(() => {
    const fetchPlayerName = async () => {
      const token = localStorage.getItem('token')
      console.log('Token:', token)
      if (!token) {
        console.error('No token found')
        return
      }

      try {
        const response = await axios.get(
          `https://localhost:3001/players/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setPlayerName(response.data.display_name)
      } catch (error) {
        console.error('Error fetching player name:', error)
      }
    }
    fetchPlayerName()
  }, [id])

  if (!playerName) {
    return <span>Unknown</span>
  }
  return <span>{playerName}</span>
}
