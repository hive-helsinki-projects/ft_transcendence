import React, { useState, useMemo } from 'react'

interface Player {
  id: number
  display_name: string
  wins: number
  losses: number
  avatar_url: string
  created_at: string
}

interface GameStatsProps {
  userPlayers: Player[]
}

const GameStats: React.FC<GameStatsProps> = ({ userPlayers }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  const selectedPlayer = useMemo(
    () => userPlayers.find((p) => p.id === selectedPlayerId),
    [selectedPlayerId, userPlayers]
  )

  const totalGames = (selectedPlayer?.wins ?? 0) + (selectedPlayer?.losses ?? 0)
  const winRate = totalGames > 0
    ? Math.round((selectedPlayer!.wins / totalGames) * 100)
    : 0

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
        <option value="" disabled>Select a player</option>
        {userPlayers.map((player) => (
          <option key={player.id} value={player.id}>
            {player.display_name}
          </option>
        ))}
      </select>

      {selectedPlayer && (
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{selectedPlayer.wins}</span>
            <span className="stat-label">Wins</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{selectedPlayer.losses}</span>
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
      )}
    </div>
  )
}

export default GameStats
