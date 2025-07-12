import { useState, useEffect } from 'react'
import axios from 'axios'

interface MatchPlayer {
  player_id: number
  score: number
}

interface Match {
  id: number
  type: string
  tournament_id: number
  date: string
  round: number
  status: string
  winner_id: number
  players: MatchPlayer[]
}

export const useUserMatchHistory = (userId: string | number) => {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get<Match[]>(
          `https://localhost:3001/match-histories/user/${userId}`
        )
        setMatches(response.data)
      } catch (error) {
        console.error('Error fetching match history:', error)
        setError('Failed to fetch match history')
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    fetchMatchHistory()
  }, [userId])

  return {
    matches,
    loading,
    error
  }
} 