import { useState, useCallback, useEffect } from 'react'
import { UserPlayer } from '../types/dashboard'
import { BaseService } from '../services/BaseService'

export const useUserPlayers = () => {
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  // Fetch all players when component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await BaseService.get<UserPlayer[]>('/players')
        console.log("players logged: ", players)
        setUserPlayers(players)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPlayers()
  }, [])

  const createPlayer = useCallback(async (playerName: string) => {
    try {
        await BaseService.post<UserPlayer>('/players', {
        display_name: playerName,
      })
      const players = await BaseService.get<UserPlayer[]>('/players')
      setUserPlayers(players)
      
    } catch (error) {
      console.error(error)
      alert(`Failed to create player: ${playerName}`)
    }
  }, [])

  const updatePlayer = useCallback(
    async (playerId: string, updates: Partial<UserPlayer>) => {
      try {
        const updatedPlayer = await BaseService.put<UserPlayer>(`/players/${playerId}`, updates)
        setUserPlayers((prev) =>
          prev.map((player) => (player.id === playerId ? updatedPlayer : player)),
        )
      } catch (error) {
        console.error(error)
        alert(`Failed to update player: ${playerId}`)
      }
    },
    [],
  )

  const deletePlayer = useCallback(async (playerId: string) => {
    try {
      await BaseService.delete<string>(`/players/${playerId}`)
      setUserPlayers((prev) => prev.filter((player) => player.id !== playerId))
    } catch (error) {
      console.error(error)
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
