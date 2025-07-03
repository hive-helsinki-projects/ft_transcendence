import React, { useState, useMemo } from 'react'
import { useTranslate } from '@hooks/index'
import { UserPlayer } from '@/types/dashboard'


interface GameStatsProps {
  userPlayers: UserPlayer[]
}

const GameStats: React.FC<GameStatsProps> = ({ userPlayers }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)
  const t = useTranslate()

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
      <h2>{t('Player Stats')}</h2>
      {/* Player Selection */}
      <label htmlFor="player-select">{t('Select Player')}:</label>
      <select
        id="player-select"
        value={selectedPlayerId ?? ''}
        onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
      >
        <option value="" disabled>{t('Select a player')}</option>
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
            <span className="stat-label">{t('stats.wins')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{selectedPlayer.losses}</span>
            <span className="stat-label">{t('stats.losses')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{winRate}%</span>
            <span className="stat-label">{t('stats.winRate')}</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{totalGames}</span>
            <span className="stat-label">{t('stats.totalGames')}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameStats
