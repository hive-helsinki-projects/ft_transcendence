// GameStats.tsx
import React, { useMemo } from 'react'
import { MatchHistory } from '../../types/match'
import { UserPlayer } from '../../types/dashboard'

interface GameStatsProps {
  matches: MatchHistory[]
  playerId: number
  setPlayerId: (id: number) => void
  userPlayers: UserPlayer[]
}

const GameStats: React.FC<GameStatsProps> = ({ matches, playerId, setPlayerId, userPlayers }) => {
  const { wins, losses, totalGames, winRate } = useMemo(() => {
    let wins = 0
    let total = 0

    matches.forEach((match) => {
      const isInMatch = match.players.some(p => p.player_id === playerId)
      if (!isInMatch) return

      total++
      if (match.winner_id === playerId) {
        wins++
      }
    })

    const losses = total - wins
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0

    return { wins, losses, totalGames: total, winRate }
  }, [matches, playerId])

  return (
    <div className="stats-section">
      <div className="stats-header">
        <h2>Player Stats</h2>
        <label htmlFor="player-select">Select Player:</label>
        <select
          id="player-select"
          value={playerId}
          onChange={(e) => setPlayerId(Number(e.target.value))}
        >
          {userPlayers.map(player => (
            <option key={player.id} value={player.id}>
              {player.display_name}
            </option>
          ))}
        </select>
      </div>

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
