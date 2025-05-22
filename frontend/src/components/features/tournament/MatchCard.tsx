import React from 'react'
import { Match } from './TournamentState'
import LoadingState from '../../LoadingState'
import useTranslate from '../../../hooks/useTranslate'

interface MatchCardProps {
  match: Match
  title: string
  onStartMatch: () => void
  isLoading?: boolean
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, title, onStartMatch, isLoading = false }) => {
  const t = useTranslate()

  return (
    <div className="match-card" role="article" aria-label={`${title} match`}>
    <h3>{title}</h3>
    <div className="match-players" role="list">
      <div className="player" role="listitem">
        <img
          src={match.player1.avatar}
          alt={`${match.player1.name}'s avatar`}
          className="player-avatar"
        />
        <span className="player-name">{match.player1.name}</span>
      </div>
      <span className="vs" aria-hidden="true">VS</span>
      <div className="player" role="listitem">
        <img
          src={match.player2.avatar}
          alt={`${match.player2.name}'s avatar`}
          className="player-avatar"
        />
        <span className="player-name">{match.player2.name}</span>
      </div>
    </div>
    {match.status === 'pending' && (
      <div className="match-actions">
        <button
          onClick={onStartMatch}
          className="start-match-button"
          disabled={isLoading}
          aria-label={`Start ${title}`}
        >
          {isLoading ? <LoadingState message={t('loading.starting')} /> : t('Start Match')}
        </button>
      </div>
    )}
    {match.status === 'in_progress' && (
      <div className="match-status" role="status">
        <LoadingState message={t('loading.matchInProgress')} />
      </div>
    )}
    {match.status === 'completed' && match.winner && (
      <div className="match-result" role="status">Winner: {match.winner}</div>
    )}
  </div>
  )
}