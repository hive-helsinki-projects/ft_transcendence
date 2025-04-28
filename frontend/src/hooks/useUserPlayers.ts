import { useState, useCallback } from 'react'
import { UserPlayer } from '../types/dashboard'

export const useUserPlayers = () => {
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  const createPlayer = useCallback((playerName: string) => {
    const newPlayer: UserPlayer = {
      id: Date.now().toString(),
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}-${Date.now()}`,
      isActive: true,
      points: 0,
    }
    setUserPlayers((prev) => [...prev, newPlayer])
  }, [])

  const updatePlayer = useCallback((playerId: string, updates: Partial<UserPlayer>) => {
    setUserPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId ? { ...player, ...updates } : player
      )
    )
  }, [])

  const deletePlayer = useCallback((playerId: string) => {
    setUserPlayers((prev) => prev.filter((player) => player.id !== playerId))
  }, [])

  return {
    userPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
} 