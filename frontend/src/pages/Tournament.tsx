import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseService } from '../services/baseService'
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
  status: 'pending' | 'finished'
  current_round: number
  winner_id: number | null
  matches: Match[]
}

const TournamentPage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [check, setCheck] = useState(false);
  const navigate = useNavigate()
  const { userPlayers } = useUserPlayers()
  const hasUpdated = useRef(false)

  const getPlayerName = (id: number): string => {
    const player = userPlayers.find(p => p.id === id)
    return player ? player.display_name : `Player ${id}`
  }

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        console.log('Fetching tournaments...');
        const res = await BaseService.get('/tournaments')
        const tournaments: Tournament[] = res.items || res

        if (tournaments.length === 0) {
          alert('No tournaments have been played yet')
          navigate('/dashboard')
          return
        }
        const latestTournament = tournaments.sort((a, b) => b.id - a.id)[0]
        setTournament(latestTournament)
      } catch (err) {
        console.error('Failed to fetch tournaments:', err)
        alert('Something went wrong loading the tournament.')
        navigate('/dashboard')
      }
    }

    fetchTournaments()
  }, [check])

  useEffect(() => {
    const updateTournamentIfComplete = async () => {
      if (!tournament || tournament.status !== 'pending') return
      if (hasUpdated.current) return;
      setCheck(false);

      if (tournament.matches.length === 1) {
        console.log('reached final!')
        return
      }
      const allPlayed = tournament.matches.every(
        (match) => match.players.length === 1 || match.players[0].score !== 0 || match.players[1].score !== 0
      )
      if (allPlayed) {
        try {
          console.log('sending tournament put request!')
          hasUpdated.current = true
          const updated = await BaseService.put(`/tournaments/${tournament.id}`, {})
          setTournament(updated)
          setCheck(true);
          console.log('updated tournament: ', updated)
          console.log('Tournament advanced to next round.')
          navigate('/tournament')
        } catch (err) {
          console.error('Failed to advance tournament:', err)
          navigate('/tournament')
        }
      }
    }
    updateTournamentIfComplete()
  }, [tournament])

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
        {!tournament ? null : tournament.status === 'finished' && tournament.winner_id ? (
          <div className="tournament-lobby">
            <div className="tournament-header">
              <h1>{tournament.name}</h1>
            </div>
            <div className="tournament-round-info">
              <h2>🏆 Tournament Completed</h2>
              <p>
                Winner: {
                  userPlayers.find((u) => u.id === tournament.winner_id)?.display_name ||
                  `Player ${tournament.winner_id ?? 'N/A'}`
                }
              </p>
              <p>
                There is no active tournament. You can create a new one from the dashboard.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="start-match-button"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
          ) :  (
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
            {tournament?.matches?.map((match) => {
              if (!Array.isArray(match.players) || match.players.length === 0) {
                return (
                  <div key={match.match_id} className="match-container">
                    <h4>Match {match.match_id} — Round {match.round + 1}</h4>
                    <p>Player data unavailable.</p>
                  </div>
                )
              }

              const player1Info = match.players[0]
              const player2Info = match.players[1] // might be undefined

              const player1 = userPlayers.find(p => p.id === player1Info?.player_id)
              const player2 = userPlayers.find(p => p.id === player2Info?.player_id)

              const isMatchUnplayed = player1Info?.score === 0 && player2Info?.score === 0

              return (
                <div key={match.match_id} className="match-container">
                  <h4>Match {match.match_id} — Round {match.round + 1}</h4>
                  <p>
                    {[player1Info, player2Info]
                      .filter(Boolean)
                      .map(p => `${getPlayerName(p!.player_id)} (Score: ${p!.score})`)
                      .join(' vs ')}
                  </p>
                  {isMatchUnplayed && player1 && player2 && (
                    <button
                      onClick={() => handleStartMatch(match, player1, player2)}
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
