import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingContainer from '../components/LoadingContainer'
import { MatchCard, ChampionCard, useTournamentState, TournamentRound } from '../components/features/tournament'
import '../assets/styles/Tournament.css'

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

  const handleMatchComplete = (
    round: TournamentRound,
    matchIndex: number,
    winner: string,
  ) => {
    try {
      updateState({ isLoading: true, error: null })
      
      if (round === 'semifinal') {
        const updatedSemifinals = [...state.semifinals]
        const match = updatedSemifinals[matchIndex]
        match.winner = winner
        match.status = 'completed'
        updateState({ semifinals: updatedSemifinals })

        const otherMatchIndex = matchIndex === 0 ? 1 : 0
        if (updatedSemifinals[otherMatchIndex].winner) {
          const finalist1 = updatedSemifinals[0].winner === updatedSemifinals[0].player1.name
            ? updatedSemifinals[0].player1
            : updatedSemifinals[0].player2

          const finalist2 = updatedSemifinals[1].winner === updatedSemifinals[1].player1.name
            ? updatedSemifinals[1].player1
            : updatedSemifinals[1].player2

          updateState({
            finalMatch: {
              player1: finalist1,
              player2: finalist2,
              winner: null,
              status: 'pending',
            },
          })
        }
      } else {
        const updatedFinalMatch = { ...state.finalMatch, winner, status: 'completed' as const }
        const winnerPlayer = winner === state.finalMatch.player1.name
          ? state.finalMatch.player1
          : state.finalMatch.player2

        updateState({
          finalMatch: updatedFinalMatch,
          champion: winnerPlayer,
        })
      }
    } catch (error) {
      console.error('Error completing match:', error)
      updateState({ error: 'Failed to complete match' })
    } finally {
      updateState({ isLoading: false })
    }
  }

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
  }, [location.state])

  return (
    <ErrorBoundary>
      <LoadingContainer>
        <div className="tournament-lobby" role="main">
          <div className="tournament-header">
            <h1>Tournament Lobby</h1>
            <button
              onClick={resetTournament}
              className="reset-tournament-button"
              disabled={state.isLoading}
              aria-label="Reset tournament"
            >
              Reset Tournament
            </button>
          </div>

          {state.error && (
            <div className="error-message" role="alert">
              {state.error}
            </div>
          )}

          <div className="tournament-bracket">
            <div className="semifinals">
              {state.semifinals.map((match, index) => (
                <div key={index} className="match-container">
                  <MatchCard
                    match={match}
                    title={`SEMIFINAL ${index + 1}`}
                    onStartMatch={() => startMatch('semifinal', index)}
                    isLoading={state.isLoading}
                  />
                </div>
              ))}
            </div>

            {state.finalMatch.player1.name && state.finalMatch.player2.name && (
              <div className="match-container">
                <MatchCard
                  match={state.finalMatch}
                  title="FINAL MATCH"
                  onStartMatch={() => startMatch('final', 0)}
                  isLoading={state.isLoading}
                />
              </div>
            )}

            {state.champion && (
              <div className="match-container">
                <ChampionCard champion={state.champion} />
              </div>
            )}
          </div>
        </div>
      </LoadingContainer>
    </ErrorBoundary>
  )
}

export default Tournament
