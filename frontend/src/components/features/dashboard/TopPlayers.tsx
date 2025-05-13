import React, { useMemo } from 'react'
import { TopPlayer } from '../../../types/dashboard'
import useTranslate from '../../../hooks/useTranslate'

interface TopPlayersProps {
  players: TopPlayer[]
}

const TopPlayers: React.FC<TopPlayersProps> = ({ players }) => {
  // Sort and slice top 4 players based on win percentage
  const topPlayers = useMemo(() => {
    if (!Array.isArray(players)) return []

    return (
      [...players]
      .filter((p) => p.wins + p.losses > 0) // Avoid division by zero
      .sort((a, b) => {
        const aPercentage = (a.wins * 100) / (a.wins + a.losses)
        const bPercentage = (b.wins * 100) / (b.wins + b.losses)
        return bPercentage - aPercentage // Descending order
      })
      .slice(0, 4)
    )
  }, [players])

  const t = useTranslate()

  return (
    <div className="top-players-section">
      <h2>{t('TOP PLAYERS')}</h2>
      <div className="players-grid">
        {topPlayers.map((player) => {
          const percentage = ((player.wins * 100) / (player.wins + player.losses)).toFixed(1)

          return (
            <div key={player.id} className="player-card">
              <img
                src={player.avatar_url}
                alt={`${player.display_name}'s avatar`}
                className="player-avatar"
              />
              <div className="player-info">
                <span className="player-name">{player.display_name}</span>
                <span className="player-points">{percentage}% win rate</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopPlayers
