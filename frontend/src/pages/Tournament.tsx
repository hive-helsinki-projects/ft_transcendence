import React, { useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingContainer from '../components/LoadingContainer'
import { MatchCard, ChampionCard, useTournamentState, TournamentRound, Match, Player } from '../components/features/tournament'
import '../assets/styles/Tournament.css'
import useTranslate from '../hooks/useTranslate'

// UI Components
const TournamentBracket: React.FC<{
  semifinals: Match[]
  finalMatch: Match
  champion: Player | null
  isLoading: boolean
  onStartMatch: (round: TournamentRound, matchIndex: number) => void
}> = ({ semifinals, finalMatch, champion, isLoading, onStartMatch }) => {
  const t = useTranslate()

  return (
    <div className="tournament-bracket">
    <div className="semifinals">
      {semifinals.map((match, index) => (
        <div key={index} className="match-container">
          <MatchCard
            match={match}
            title={`${t('SEMIFINAL')} ${index + 1}`}
            onStartMatch={() => onStartMatch('semifinal', index)}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>

    {finalMatch.player1.name && finalMatch.player2.name && (
      <div className="match-container">
        <MatchCard
          match={finalMatch}
          title={t('FINAL MATCH')}
          onStartMatch={() => onStartMatch('final', 0)}
          isLoading={isLoading}
        />
      </div>
    )}

    {champion && (
      <div className="match-container">
        <ChampionCard champion={champion} />
      </div>
    )}
  </div>
  )
}

const TournamentHeader: React.FC<{
  onReset: () => void
  isLoading: boolean
}> = ({ onReset, isLoading }) => {
  const t = useTranslate()

  return (
    <div className="tournament-header">
    <h1>{t('Tournament Lobby')}</h1>
    <button
      onClick={onReset}
      className="reset-tournament-button"
      disabled={isLoading}
      aria-label="Reset tournament"
    >
      {t('Reset Tournament')}
    </button>
  </div>
  )
}

// Helper functions
const getWinnerPlayer = (match: Match, winnerName: string): Player => 
  winnerName === match.player1.name ? match.player1 : match.player2

const updateMatchWithWinner = (match: Match, winner: string): Match => ({
  ...match,
  winner,
  status: 'completed' as const
})

const Tournament: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, updateState, resetTournament } = useTournamentState()

  const startMatch = async (round: TournamentRound, matchIndex: number) => {
    try {
      updateState({ isLoading: true, error: null })
      const match = round === 'semifinal' ? state.semifinals[matchIndex] : state.finalMatch
      const updatedMatch = { ...match, status: 'in_progress' as const }

      if (round === 'semifinal') {
        const updatedSemifinals = [...state.semifinals]
        updatedSemifinals[matchIndex] = updatedMatch
        updateState({ semifinals: updatedSemifinals })
      } else {
        updateState({ finalMatch: updatedMatch })
      }

      navigate('/game', {
        state: {
          matchType: round,
          matchIndex,
          player1: match.player1,
          player2: match.player2,
          returnTo: '/tournament',
        },
      })
    } catch (error) {
      console.error('Error starting match:', error)
      updateState({ error: 'Failed to start match' })
    } finally {
      updateState({ isLoading: false })
    }
  }

  const handleSemifinalComplete = useCallback((matchIndex: number, winner: string) => {
    const updatedSemifinals = [...state.semifinals]
    const match = updatedSemifinals[matchIndex]
    match.winner = winner
    match.status = 'completed'
    updateState({ semifinals: updatedSemifinals })

    const otherMatchIndex = matchIndex === 0 ? 1 : 0
    if (updatedSemifinals[otherMatchIndex].winner) {
      const finalist1 = getWinnerPlayer(updatedSemifinals[0], updatedSemifinals[0].winner!)
      const finalist2 = getWinnerPlayer(updatedSemifinals[1], updatedSemifinals[1].winner!)

      updateState({
        finalMatch: {
          player1: finalist1,
          player2: finalist2,
          winner: null,
          status: 'pending',
        },
      })
    }
  }, [state.semifinals, updateState])

  const handleFinalComplete = useCallback((winner: string) => {
    const updatedFinalMatch = updateMatchWithWinner(state.finalMatch, winner)
    const winnerPlayer = getWinnerPlayer(state.finalMatch, winner)

    updateState({
      finalMatch: updatedFinalMatch,
      champion: winnerPlayer,
    })
  }, [state.finalMatch, updateState])

  const handleMatchComplete = useCallback((
    round: TournamentRound,
    matchIndex: number,
    winner: string,
  ) => {
    try {
      updateState({ isLoading: true, error: null })
      
      if (round === 'semifinal') {
        handleSemifinalComplete(matchIndex, winner)
      } else {
        handleFinalComplete(winner)
      }
    } catch (error) {
      console.error('Error completing match:', error)
      updateState({ error: 'Failed to complete match' })
    } finally {
      updateState({ isLoading: false })
    }
  }, [handleSemifinalComplete, handleFinalComplete, updateState])

  useEffect(() => {
    const state = location.state as {
      matchType?: TournamentRound
      matchIndex?: number
      winner?: string
    }
    if (state?.matchType && state?.winner) {
      handleMatchComplete(state.matchType, state.matchIndex || 0, state.winner)
      navigate('/tournament', { replace: true })
    }
  }, [location.state, handleMatchComplete, navigate])

  return (
    <ErrorBoundary>
      <LoadingContainer>
        <div className="tournament-lobby" role="main">
          <TournamentHeader onReset={resetTournament} isLoading={state.isLoading} />

          {state.error && (
            <div className="error-message" role="alert">
              {state.error}
            </div>
          )}

          <TournamentBracket
            semifinals={state.semifinals}
            finalMatch={state.finalMatch}
            champion={state.champion}
            isLoading={state.isLoading}
            onStartMatch={startMatch}
          />
        </div>
      </LoadingContainer>
    </ErrorBoundary>
  )
}

export default Tournament
