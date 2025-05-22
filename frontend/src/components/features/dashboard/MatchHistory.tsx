import React, { useMemo } from 'react'
import useTranslate from '../../../hooks/useTranslate'

interface MatchHistory {
  id: string
  player: {
    name: string
    avatar: string
  }
  opponent: {
    name: string
    avatar: string
  }
  result: 'win' | 'loss'
  score: string
  date: string // assumed to be ISO 8601 or comparable format
  mode: '1v1' | 'tournament'
}

interface MatchHistoryProps {
  matches: MatchHistory[]
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  // Only take the last 3 matches (sorted by most recent)
  const recentMatches = useMemo(() => {
    if (!Array.isArray(matches)) return []

    return (
      [...matches]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
    )
  }, [matches])

  const t = useTranslate()

  return (
    <div className="recent-matches-section">
      <h2>{t('Recent Matches')}</h2>
      <div className="matches-list">
        {recentMatches.map((match) => (
          <div key={match.id} className={`match-item ${match.result}`}>
            <div className="match-info">
              <span className="match-mode">
                {match.mode === '1v1' ? '🏓' : '🏆'}
              </span>
              <div className="match-players">
                {match.mode === '1v1' ? (
                  <>
                    <div className="player">
                      <img
                        src={match.player.avatar}
                        alt={match.player.name}
                        className="player-avatar"
                      />
                      <span className="player-name">{match.player.name}</span>
                    </div>
                    <span className="vs">vs</span>
                    <div className="player">
                      <img
                        src={match.opponent.avatar}
                        alt={match.opponent.name}
                        className="player-avatar"
                      />
                      <span className="player-name">{match.opponent.name}</span>
                    </div>
                  </>
                ) : (
                  <div className="player">
                    <img
                      src={
                        match.result === 'win'
                          ? match.player.avatar
                          : match.opponent.avatar
                      }
                      alt="Winner"
                      className="player-avatar"
                    />
                    <span className="player-name tournament-winner">
                      {match.result === 'win'
                        ? match.player.name
                        : match.opponent.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="match-details">
              {match.mode === '1v1' && (
                <span className="match-score">{match.score}</span>
              )}
              <span className="match-date">{match.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchHistory
