import { Tournament, TournamentMatch } from '@/types/dashboard'
import { BaseService } from '@services/baseService'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserPlayers } from '@hooks/index'
import { useTranslate } from '@hooks/index'

export const TournamentPage: React.FC = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [check, setCheck] = useState(false)
  const navigate = useNavigate()
  const { userPlayers } = useUserPlayers()
  const hasUpdated = useRef(false)

  const getPlayerName = (id: number): string => {
    const player = userPlayers.find((p) => p.id === id)
    return player ? player.display_name : `Player ${id}`
  }

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        console.log('Fetching tournaments...')
        const res = await BaseService.get<
          Tournament[] | { items: Tournament[] }
        >('/tournaments')
        const tournaments: Tournament[] = 'items' in res ? res.items : res

        if (tournaments.length === 0) {
          alert(t('tournament.nonePlayed'))
          navigate('/dashboard')
          return
        }
        const latestTournament = tournaments.sort((a, b) => b.id - a.id)[0]
        setTournament(latestTournament)
      } catch (err) {
        console.error('Failed to fetch tournaments:', err)
        alert(t('tournament.loadingErr'))
        navigate('/dashboard')
      }
    }
    fetchTournaments()
  }, [check])

  useEffect(() => {
    const updateTournamentIfComplete = async () => {
      if (!tournament || tournament.status !== 'pending') return
      if (hasUpdated.current) return
      setCheck(false)

      if (tournament.matches.length === 1) {
        console.log('reached final!')
        return
      }
      const allPlayed = tournament.matches.every(
        (match) =>
          match.players.length === 1 ||
          match.players[0].score !== 0 ||
          match.players[1].score !== 0,
      )
      if (allPlayed) {
        try {
          console.log('sending tournament put request!')
          hasUpdated.current = true
          const updated = (await BaseService.put(
            `/tournaments/${tournament.id}`,
            {},
          )) as Tournament
          setTournament(updated)
          setCheck(true)
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
      t('tournament.confirmReset', { name: tournament.name })
    )
    if (!confirmReset) return

    try {
      await BaseService.delete(`/tournaments/${tournament.id}`)
      alert(t('tournament.deletedSuccess'))
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to delete tournament:', error)
      alert(t('tournament.deleteFailed'))
    }
  }

  const handleStartMatch = (
    match: TournamentMatch,
    player1: { id: number; display_name: string; avatar: string },
    player2: { id: number; display_name: string; avatar: string },
  ) => {
    if (!player1 || !player2) {
      alert(t('tournament.missingPlayerInfo'))
      return
    }

    const currentMatches = tournament!.matches.filter(
      (m) => m.round === tournament!.current_round,
    )

    const matchType = currentMatches.length > 1 ? 'semifinal' : 'final'

    navigate('/game', {
      state: {
        matchId: match.match_id,
        matchType,
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

  const t = useTranslate()

  return (
    <>
        {!tournament ? null : tournament.status === 'finished' &&
          tournament.winner_id ? (
          <div className="tournament-lobby">
            <div className="tournament-header">
              <h1>{t(`TournamentNames.${tournament.name}`)}</h1>
            </div>
            <div className="tournament-round-info">
              <h2>🏆 {t('Tournament Completed')}</h2>
              <p className="tournament-winner">
                {t('Winner')}:{' '}
                {userPlayers.find((u) => u.id === tournament.winner_id)
                  ?.display_name || `${t('Player')} ${tournament.winner_id ?? 'N/A'}`}
              </p>
              <p className = "mb-4">{t('tournament.noActive')}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                {t('Go to Dashboard')}
              </button>
            </div>
          </div>
        ) : (
          <div className="tournament-lobby">
            {/* Header */}
            <div className="tournament-header">
              <h1>{t(`TournamentNames.${tournament.name}`)}</h1>
              <button
                className="btn-primary"
                onClick={handleReset}
                aria-label="Reset tournament"
              >
                {t('Reset Tournament')}
              </button>
            </div>

            {/* Round Info */}
            <div className="tournament-round-info">
              <h2>{t('Current Round')}: {tournament.current_round + 1}</h2>
            </div>

            {/* Matches */}
            <div className="tournament-bracket">
              {tournament?.matches?.map((match) => {
                if (
                  !Array.isArray(match.players) ||
                  match.players.length === 0
                ) {
                  return (
                    <div key={match.match_id} className="match-container">
                      <h4>
                        {t('tournament.matchInfo', {
                          matchId: match.match_id,
                          round: match.round + 1
                        })}
                      </h4>
                      <p>{t('tournament.playerDataUnavailable')}</p>
                    </div>
                  )
                }

                const player1Info = match.players[0]
                const player2Info = match.players[1] // might be undefined

                const player1 = userPlayers.find(
                  (p) => p.id === player1Info?.player_id,
                )
                const player2 = userPlayers.find(
                  (p) => p.id === player2Info?.player_id,
                )

                const isMatchUnplayed =
                  player1Info?.score === 0 && player2Info?.score === 0

                return (
                  <div key={match.match_id} className="match-container">
                    <h4>
                        {t('tournament.matchInfo', {
                          matchId: match.match_id,
                          round: match.round + 1
                        })}
                      </h4>
                    <p>
                      {[player1Info, player2Info]
                        .filter(Boolean)
                        .map(
                          (p) =>
                            `${getPlayerName(p!.player_id)} (${t('Score')}: ${p!.score})`,
                        )
                        .join(' vs ')}
                    </p>
                    {isMatchUnplayed && player1 && player2 && (
                      <button
                        onClick={() =>
                          handleStartMatch(match, player1, player2)
                        }
                        className="btn-primary"
                        aria-label={`Start Match ${match.match_id}`}
                      >
                        {t('Start Match')}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
    </>
  )
}
