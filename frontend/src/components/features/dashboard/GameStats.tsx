import React, { useState, useEffect, useMemo } from 'react'
import { MatchHistory } from '../../types/match'

interface GameStatsProps {
  matches: MatchHistory[]
  userPlayers: { id: number; display_name: string }[]
}

const GameStats: React.FC<GameStatsProps> = ({ matches, userPlayers }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const [filteredMatches, setFilteredMatches] = useState<MatchHistory[]>([])

  // Filter matches whenever selected player changes
  useEffect(() => {
    if (!matches || !Array.isArray(matches)) {
      setFilteredMatches([])
      return
    }
    const updatedFilteredMatches = selectedPlayerId
      ? matches.filter((match) =>
          match.players.some((p) => p.player_id === selectedPlayerId)
        )
      : []
    setFilteredMatches(updatedFilteredMatches)
  }, [matches, selectedPlayerId])

  // Calculate stats based on filtered matches
  const { wins, losses, totalGames, winRate } = useMemo(() => {
    let wins = 0
    let total = 0

    filteredMatches.forEach((match) => {
      const isInMatch = match.players.some((p) => p.player_id === selectedPlayerId)
      if (!isInMatch) return

      total++
      if (match.winner_id === selectedPlayerId) {
        wins++
      }
    })

    const losses = total - wins
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

    return { wins, losses, totalGames: total, winRate }
  }, [filteredMatches, selectedPlayerId])

  return (
    <div className="stats-section">
      <h2>Player Stats</h2>
      {/* Player Selection */}
      <label htmlFor="player-select">Select Player:</label>
      <select
        id="player-select"
        value={selectedPlayerId ?? ''}
        onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
      >
        {userPlayers.map((player) => (
          <option key={player.id} value={player.id}>
            {player.display_name}
          </option>
        ))}
      </select>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{wins}</span>
          <span className="stat-label">Wins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{losses}</span>
          <span className="stat-label">Losses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{winRate}%</span>
          <span className="stat-label">Win Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalGames}</span>
          <span className="stat-label">Total Games</span>
        </div>
      </div>
    </div>
  )
}

export default GameStats
