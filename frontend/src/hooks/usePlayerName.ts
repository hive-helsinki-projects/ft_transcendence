import { useState, useEffect } from 'react'
import axios from 'axios'

export const usePlayerName = (playerId: string | number) => {
  const [playerName, setPlayerName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerName = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('No token found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(
          `https://localhost:3001/players/${playerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setPlayerName(response.data.display_name)
      } catch (error) {
        console.error('Error fetching player name:', error)
        setError('Failed to fetch player name')
        setPlayerName('Unknown')
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerName()
  }, [playerId])

  return {
    playerName,
    loading,
    error
  }
} 