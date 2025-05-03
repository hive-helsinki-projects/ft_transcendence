import { useState, useCallback, useEffect } from 'react'
import { UserPlayer } from '../types/dashboard'
import { api } from '../services/api'

export const useUserPlayers = () => {
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const players = await api.get('/players')
        setUserPlayers(players)
      } catch (err) {
        console.error('Failed to fetch players', err)
      }
    }

    fetchPlayers()
  }, [])

  const createPlayer = useCallback(async (playerName: string) => {
    try {
      const newPlayer = await api.post('/players', { name: playerName })
      setUserPlayers((prev) => [...prev, newPlayer])
    } catch (err) {
      console.error(err)
      alert(`Failed to create player: ${playerName}`)
    }
  }, [])

  const updatePlayer = useCallback(
    async (playerId: string, updates: Partial<UserPlayer>) => {
      try {
        const updatedPlayer = await api.post(`/players/${playerId}`, updates) // You may want PUT or PATCH here depending on backend
        setUserPlayers((prev) =>
          prev.map((player) =>
            player.id === playerId ? updatedPlayer : player
          )
        )
      } catch (err) {
        console.error(err)
        alert(`Failed to update player: ${playerId}`)
      }
    },
    []
  )

  const deletePlayer = useCallback(async (playerId: string) => {
    try {
      await api.post(`/players/${playerId}/delete`, {}) // if your backend needs POST or DELETE, adjust here
      setUserPlayers((prev) =>
        prev.filter((player) => player.id !== playerId)
      )
    } catch (err) {
      console.error(err)
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
