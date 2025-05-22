import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseService } from '../../../services/BaseService'
import useTranslate from '../../../hooks/useTranslate'

interface UserPlayer {
  id: number
  display_name: string
  avatar: string
  isActive: boolean
  points: number
}

interface QuickPlayProps {
  userPlayers: UserPlayer[]
}

const QuickPlay: React.FC<QuickPlayProps> = ({ userPlayers }) => {
  const navigate = useNavigate()
  const hasActivePlayers = userPlayers.length > 0
  const hasEnoughPlayers1v1 = userPlayers.length >= 2
  const hasEnoughPlayersTourn = userPlayers.length >= 4

  const [showModal1v1, setShowModal1v1] = useState(false)
  const [showModalTourn, setShowModalTourn] = useState(false)

  const [selected1v1Players, setSelected1v1Players] = useState<number[]>([])
  const [selectedTournamentPlayers, setSelectedTournamentPlayers] = useState<number[]>([])
  

  const t = useTranslate()

  const handleOneVsOneClick = () => {
    if (!hasActivePlayers) {
      alert('Please create a player before starting a 1v1 match')
      return
    }
    if (!hasEnoughPlayers1v1) {
      alert('You need at least 2 players to start a 1v1 match')
      return
    }
    setSelected1v1Players([])
    setShowModal1v1(true)
  }

  const handleTournamentClick = async () => {
    if (!hasActivePlayers) {
      alert('Please create a player before joining a tournament')
      return
    }
  
    if (!hasEnoughPlayersTourn) {
      alert('You need at least 4 players for a tournament')
      return
    }
  
    try {
      const res = await BaseService.get('/tournaments') // adjust based on your API shape
      const tournaments = res.items || res
      const activeTournament = tournaments.find((t: any) => t.status === 'pending')
  
      if (activeTournament) {
        navigate('/tournament')
      } else {
        setSelectedTournamentPlayers([])
        setShowModalTourn(true)
      }
    } catch (err) {
      console.error('Error checking for active tournament:', err)
      alert('Failed to check existing tournaments')
    }
  }

  const handleToggle1v1Player = (id: number) => {
    setSelected1v1Players((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id)
      } else if (prev.length < 2) {
        return [...prev, id]
      } else {
        return prev
      }
    })
  }

  const handleToggleTournamentPlayer = (id: number) => {
    setSelectedTournamentPlayers((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 8
        ? [...prev, id]
        : prev
    )
  }

  const handleStartMatch = async () => {
    if (selected1v1Players.length !== 2) {
      alert('Please select exactly two players')
      return
    }

    const [player1Id, player2Id] = selected1v1Players

    try {
      const matchData = await BaseService.post('/match-histories', {
        type: '1v1',
        players: [
          { player_id: player1Id },
          { player_id: player2Id },
        ],
      })

      const matchId = matchData.match_id

      const player1 = userPlayers.find(p => p.id === player1Id)!
      const player2 = userPlayers.find(p => p.id === player2Id)!

      navigate('/game', {
        state: {
          matchId,
          matchType: '1v1',
          player1: { name: player1.display_name, avatar: player1.avatar, id: player1.id },
          player2: { name: player2.display_name, avatar: player2.avatar, id: player2.id },
          returnTo: '/dashboard',
        },
      })
    } catch (error) {
      alert('Failed to start match')
      console.error(error)
    }
  }

  const handleStartTournament = async () => {
    if (selectedTournamentPlayers.length < 4 || selectedTournamentPlayers.length > 8) {
      alert('You must select between 4 and 8 players for the tournament')
      return
    }
  
    const selected = userPlayers.filter((p) => selectedTournamentPlayers.includes(p.id))
    
    const tournamentUniqueId = `Tournament-${Date.now()}`; 
    try {
        await BaseService.post('/tournaments', {
          name: `The Great Paddle-Off ${tournamentUniqueId}`,
          player_ids: selected.map((p) => p.id),
        })
      navigate('/tournament')
    } catch (error) {
      console.error('Error starting tournament:', error)
      alert('There was an error creating the tournament. Please try again.')
    }
  }

  return (
    <div className="quick-play-section">
      <h2>{t('Game Modes')}</h2>
      <div className="play-options">
        <button className="play-button one-vs-one" onClick={handleOneVsOneClick}>
          <span className="button-icon">🏓</span>
          {t('1v1 Match')}
        </button>
        <button
          className="play-button matchmaking"
          onClick={handleTournamentClick}
          title="Tournament Mode (4-8 players)"
        >
          <span className="button-icon">🏆</span>
          {t('Tournament Mode')}
          <span className="tournament-info">{t('4-8 players')}</span>
        </button>
      </div>

      {/* 1v1 Modal */}
      {showModal1v1 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select 2 Players For 1v1 Match</h3>
            <div className="player-checkboxes">
              {userPlayers.map((player) => (
                <label key={player.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'left',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #ccc',
                }}>
                  <input
                    type="checkbox"
                    checked={selected1v1Players.includes(player.id)}
                    onChange={() => handleToggle1v1Player(player.id)}
                    disabled={
                      !selected1v1Players.includes(player.id) &&
                      selected1v1Players.length >= 2
                    }
                    style={{ width: '16px', height: '16px' }}
                    />
                    <span>{player.display_name}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleStartMatch} className="create-button">Start Match</button>
              <button onClick={() => setShowModal1v1(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tournament Modal */}
      {showModalTourn && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select 4-8 Players for Tournament</h3>
            <div className="player-checkboxes">
              {userPlayers.map((player) => (
                <label key={player.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'left',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #ccc',
                }}>
                  <input
                    type="checkbox"
                    checked={selectedTournamentPlayers.includes(player.id)}
                    onChange={() => handleToggleTournamentPlayer(player.id)}
                    style={{ width: '16px', height: '16px' }}
                    />
                    <span>{player.display_name}</span>
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={handleStartTournament} className="create-button">Start Tournament</button>
              <button onClick={() => setShowModalTourn(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickPlay
