import { useState, useCallback, useEffect } from 'react'
import { UserPlayer } from '../types/dashboard'

export const useUserPlayers = () => {
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  // get all players from backend when component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      const response = await fetch('https://localhost:3001/players')
      const players = await response.json()
      setUserPlayers(players)
    }

    fetchPlayers()
  }, [])

  const createPlayer = useCallback(async (playerName: string) => {
    try {
      const response = await fetch('https://localhost:3001/players', {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName}),
      })

      if (!response.ok) {
        throw new Error('Failed to create player')
      }

      const newPlayer: UserPlayer = await response.json()
      setUserPlayers((prev) => [...prev, newPlayer])

    } catch (error) {
      console.log(error)
      alert(`Failed to create player: ${playerName}`)
    }
  }, [])

  const updatePlayer = useCallback(async (playerId: string, updates: Partial<UserPlayer>) => {
    try {
      const response = await fetch(`https://localhost:3001/players/${playerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(updates),
      })

      if(!response.ok) {
        throw new Error('Failed to update player')
      }

      const updatedPlayer: userPlayer = await response.json()

      setUserPlayers((prev) => 
        prev.map((player) =>
          player.id === playerId ? updatedPlayer : player
      )
    )
    } catch (error) {
      console.log(error)
      alert(`Failed to update player: ${playerId}`)
    }
  }, [])

  const deletePlayer = useCallback(async (playerId: string) => {
    try {
      const response = await fetch(`https://localhost:3001/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json'},
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      setUserPlayers((prev) => prev.filter((player) => player.id !== playerId))
    } catch (error) {
      alert(`Failed to delete player: ${playerId}`)
    }
  }, [])

  return {
    userPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
} 