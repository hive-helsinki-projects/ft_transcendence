import React, { useMemo } from 'react'
import { useUserPlayers } from '../../../hooks/useUserPlayers'
import useTranslate from '../../../hooks/useTranslate'

interface Match {
  id: number
  type: '1v1' | 'tournament'
  tournament_id: number | null
  date: string
  round: number | null
  winner_id: number
  players: {
    player_id: number
    score: number
  }[]
}

interface MatchHistoryProps {
  matches: Match[]
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  const { userPlayers } = useUserPlayers()
  const t = useTranslate()

  const recentMatches = useMemo(() => {
    if (!Array.isArray(matches) || userPlayers.length === 0) return []

    return [...matches]
      .filter((match) => {
        const [p1, p2] = match.players
        return !(p1.score === 0 && p2.score === 0)
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((match) => {
        const [p1, p2] = match.players
        const player1 = userPlayers.find((u) => u.id === p1.player_id)
        const player2 = userPlayers.find((u) => u.id === p2.player_id)

        if (!player1 || !player2) return null

        return {
          id: match.id.toString(),
          player: {
            name: player1.display_name,
            avatar: player1.avatar_url
          },
          opponent: {
            name: player2.display_name,
            avatar: player2.avatar_url
          },
          score: `${p1.score} - ${p2.score}`,
          date: new Date(match.date).toLocaleDateString(),
          mode: match.type
        }
      })
      .filter(Boolean)
  }, [matches, userPlayers])

  return (
    <div className="recent-matches-section">
      <h2>{t('Recent Matches')}</h2>
      <div className="matches-list">
        {recentMatches.map((match) => (
          <div key={match.id} className={`match-item`}>
            <div className="match-info">
              <span className="match-mode">
                {match.mode === '1v1' ? '🏓' : '🏆'}
              </span>
              <div className="match-players">
                <div className="player">
                  <img src={match.player.avatar} alt={match.player.name} className="player-avatar" />
                  <span className="player-name">{match.player.name}</span>
                </div>
                <span className="vs">vs</span>
                <div className="player">
                  <img src={match.opponent.avatar} alt={match.opponent.name} className="player-avatar" />
                  <span className="player-name">{match.opponent.name}</span>
                </div>
              </div>
            </div>
            <div className="match-details">
              <span className="match-score">{match.score}</span>
              <span className="match-date">{match.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchHistory
