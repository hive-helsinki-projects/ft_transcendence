import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseService } from '../services/BaseService'
import '../assets/styles/Tournament.css'
import { useUserPlayers } from '../hooks/useUserPlayers'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingContainer from '../components/LoadingContainer'

interface PlayerInfo {
  player_id: number
  score: number
}

interface Match {
  match_id: number
  players: PlayerInfo[]
  date: string
  round: number
}

interface Tournament {
  id: number
  name: string
  status: 'pending' | 'completed'
  current_round: number
  winner_id: number | null
  matches: Match[]
}

const TournamentPage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const navigate = useNavigate()
  const { userPlayers } = useUserPlayers()

  const getPlayerName = (id: number): string => {
    const player = userPlayers.find(p => p.id === id)
    return player ? player.display_name : `Player ${id}`
  }

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const res = await BaseService.get('/tournaments')
        const tournaments: Tournament[] = res.items || res

        const activeTournament = tournaments.find(t => t.status === 'pending')
        if (activeTournament) {
          setTournament(activeTournament)
        } else {
          alert('No ongoing tournament found.')
          navigate('/dashboard')
        }
      } catch (err) {
        console.error('Failed to fetch tournaments:', err)
        alert('Something went wrong loading the tournament.')
        navigate('/dashboard')
      }
    }

    fetchTournaments()
  }, [navigate])

  const handleReset = async () => {
    if (!tournament) return
  
    const confirmReset = window.confirm(
      `Are you sure you want to delete the tournament "${tournament.name}"?`
    )
    if (!confirmReset) return
  
    try {
      const res = await BaseService.delete(`/tournaments/${tournament.id}`)
      alert(res.message || 'Tournament deleted successfully.')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to delete tournament:', error)
      alert('Failed to reset tournament. Please try again.')
    }
  }

  const handleStartMatch = (
    match: Match,
    player1: { id: number; display_name: string; avatar: string },
    player2: { id: number; display_name: string; avatar: string }
  ) => {
    if (!player1 || !player2) {
      alert('Player information is missing.')
      return
    }

    navigate('/game', {
      state: {
        matchId: match.match_id,
        matchType: 'tournament',
        player1: {
          name: player1.display_name,
          avatar: player1.avatar,
          id: player1.id,
        },
        player2: {
          name: player2.display_name,
          avatar: player2.avatar,
          id: player2.id,
        },
        returnTo: '/tournament',
      },
    })
  }

  return (
    <ErrorBoundary>
      <LoadingContainer>
        {!tournament ? null : (
          <div className="tournament-lobby">
            {/* Header */}
            <div className="tournament-header">
              <h1>{tournament.name}</h1>
              <button
                className="reset-tournament-button"
                onClick={handleReset}
                aria-label="Reset tournament"
              >
                Reset Tournament
              </button>
            </div>

            {/* Round Info */}
            <div className="tournament-round-info">
              <h2>Current Round: {tournament.current_round + 1}</h2>
              {tournament.status === 'completed' && tournament.winner_id && (
                <div className="match-container">
                  <h3>🏆 Winner: Player {tournament.winner_id}</h3>
                </div>
              )}
            </div>

            {/* Matches */}
            <div className="tournament-bracket">
              {tournament.matches.map((match) => {
                const [player1Info, player2Info] = match.players

                const player1 = userPlayers.find(p => p.id === player1Info.player_id)
                const player2 = userPlayers.find(p => p.id === player2Info.player_id)

                const isMatchUnplayed = player1Info?.score === 0 && player2Info?.score === 0


                return (
                  <div key={match.match_id} className="match-container">
                    <h4>
                      Match {match.match_id} — Round {match.round + 1}
                    </h4>
                    <p>
                      {match.players
                        .map(
                          (p) => `${getPlayerName(p.player_id)} (Score: ${p.score})`
                        )
                        .join(' vs ')}
                    </p>
                    {isMatchUnplayed && player1 && player2 &&(
                    <button
                      onClick={() =>
                        player1 && player2 && handleStartMatch(match, player1, player2)
                      }
                      className="start-match-button"
                      aria-label={`Start Match ${match.match_id}`}
                    >
                      Start Match
                    </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </LoadingContainer>
    </ErrorBoundary>
  )
}

export default TournamentPage
