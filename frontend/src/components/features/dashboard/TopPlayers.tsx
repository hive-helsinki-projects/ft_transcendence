import { UserPlayer } from '@/types/dashboard'
import { useTranslate } from '@hooks/index'
import React, { useMemo } from 'react'

interface TopPlayersProps {
  players: UserPlayer[]
}

export const TopPlayers: React.FC<TopPlayersProps> = ({ players }) => {
  // Sort and slice top 4 players based on win percentage
  const topPlayers = useMemo(() => {
    if (!Array.isArray(players)) return []

    return [...players]
      .filter((p) => p.wins + p.losses > 0) // Avoid division by zero
      .sort((a, b) => {
        const aGames = a.wins + a.losses
        const bGames = b.wins + b.losses

        const aWinRate = (a.wins * 100) / aGames
        const bWinRate = (b.wins * 100) / bGames

        // Weighted score: win rate × log(games)
        const aScore = aWinRate * Math.log10(aGames + 1)
        const bScore = bWinRate * Math.log10(bGames + 1)

        return bScore - aScore
      })
      .slice(0, 4)
  }, [players])

  const t = useTranslate()

  return (
    <div className="top-players-section">
      <h2>{t('TOP PLAYERS')}</h2>
      <div className="players-grid">
        {topPlayers.map((player) => {
          const totalGames = player.wins + player.losses
          const winRate = (player.wins * 100) / totalGames
          const weightedScore = (winRate * Math.log10(totalGames + 1)).toFixed(
            1,
          )
          return (
            <div key={player.id} className="player-card">
              <img
                src={player.avatar}
                alt={`${player.display_name}'s avatar`}
                className="player-avatar"
              />
              <div className="player-info">
                <span className="player-name">{player.display_name}</span>
                <span className="player-points">
                  Weighted score: {weightedScore}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
