import { UserPlayer } from '@/types/dashboard'
import { API_URL } from '@/utils/constants'
import { BaseService } from '@services/baseService'
import { useCallback, useEffect, useState } from 'react'

interface RawPlayer {
  id: number
  display_name: string
  avatar?: string
  wins?: number
  losses?: number
  isActive?: boolean
  points?: number
}

export const useUserPlayers = () => {
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  // Fetch all players when component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const rawPlayers = await BaseService.get<RawPlayer[]>('/players')
        const mapped = rawPlayers.map((r) => ({
          id: r.id,
          display_name: r.display_name,
          // prepend backend host, fallback to placeholder-avatar based on id index
          avatar: r.avatar
            ? `${API_URL}${r.avatar}`
            : `${API_URL}/uploads/placeholder-avatar${(r.id % 4) + 1}.png`,
          isActive: r.isActive ?? false,
          points: r.points ?? 0,
          wins: r.wins ?? 0,
          losses: r.losses ?? 0,
        }))
        setUserPlayers(mapped)
      } catch (error) {
        console.error('Failed to fetch players:', error)
      }
    }

    fetchPlayers()
  }, [])

  const createPlayer = useCallback(async (playerName: string) => {
    try {
      await BaseService.post<RawPlayer>('/players', {
        display_name: playerName,
      })
      // refetch list
      const rawPlayers = await BaseService.get<RawPlayer[]>('/players')
      const mapped = rawPlayers.map((r) => ({
        id: r.id,
        display_name: r.display_name,
        avatar: r.avatar
          ? `${API_URL}${r.avatar}`
          : `${API_URL}/uploads/placeholder-avatar${(r.id % 4) + 1}.png`,
        isActive: r.isActive ?? false,
        points: r.points ?? 0,
      }))
      setUserPlayers(mapped)
    } catch (error) {
      console.error(error)
      alert(`Failed to create player: ${playerName}`)
    }
  }, [])

  const deletePlayer = useCallback(async (playerId: number) => {
    try {
      await BaseService.delete<string>(`/players/${playerId}`)
      // Refetch updated player list
      const rawPlayers = await BaseService.get<RawPlayer[]>('/players')
      const mapped = rawPlayers.map((r) => ({
        id: r.id,
        display_name: r.display_name,
        avatar: r.avatar
          ? `${API_URL}${r.avatar}`
          : `${API_URL}/uploads/placeholder-avatar${(r.id % 4) + 1}.png`,
        isActive: r.isActive ?? false,
        points: r.points ?? 0,
        wins: r.wins ?? 0,
        losses: r.losses ?? 0,
      }))
      setUserPlayers(mapped)
    } catch (error) {
      console.error(error)
      alert(`Failed to delete player: ${playerId}`)
    }
  }, [])

  return {
    userPlayers,
    createPlayer,
    deletePlayer,
  }
}
