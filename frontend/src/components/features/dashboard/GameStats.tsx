import React from 'react'

interface GameStats {
  wins: number
  losses: number
  winRate: number
  totalGames: number
}

interface GameStatsProps {
  stats: GameStats
}

const GameStats: React.FC<GameStatsProps> = ({ stats }) => (
  <div className="stats-section">
    <h2>Your Stats</h2>
    <div className="stats-grid">
      <div className="stat-item">
        <span className="stat-value">{stats.wins}</span>
        <span className="stat-label">Wins</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.losses}</span>
        <span className="stat-label">Losses</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.winRate}%</span>
        <span className="stat-label">Win Rate</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.totalGames}</span>
        <span className="stat-label">Total Games</span>
      </div>
    </div>
  </div>
)

export default GameStats 