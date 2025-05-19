import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTranslate from '../../../hooks/useTranslate'

interface UserPlayer {
  id: string
  name: string
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
  const hasEnoughPlayers = userPlayers.length >= 2
  const [showModal, setShowModal] = useState(false)
  const [player1Id, setPlayer1Id] = useState('')
  const [player2Id, setPlayer2Id] = useState('')

  const t = useTranslate()

  const handleTournamentClick = () => {
    if (!hasActivePlayers) {
      alert('Please create a player before joining a tournament')
      return
    }
    navigate('/tournament')
  }

  const handleOneVsOneClick = () => {
    if (!hasActivePlayers) {
      alert('Please create a player before starting a 1v1 match')
      return
    }
    if (!hasEnoughPlayers) {
      alert('You need at least 2 players to start a 1v1 match')
      return
    }
    setShowModal(true);
  }

  const handleStartMatch = () => {
    if (!player1Id || !player2Id) {
      alert('Please select two players')
      return
    }
    if (player1Id == player2Id) {
      alert('Players must be different')
      return
    }
    navigate('/game', {
      state: { player1Id, player2Id },
    })
  }

  return (
    <div className="quick-play-section">
      <h2>{t('Game Modes')}</h2>
      <div className="play-options">
        <button
          className="play-button one-vs-one"
          onClick={handleOneVsOneClick}
        >
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

      {showModal &&  (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('Select Players For 1v1 Match')}</h3>
            <label>
              Player 1:
                <select  value={player1Id} onChange={(e) => setPlayer1Id(e.target.value) }>
                  <option value="">{t('Select Player')}</option>
                  {userPlayers.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.display_name}
                    </option>
                  ))}
                </select>
            </label>
            <br />
            <label>
              Player 2:
              <select value={player2Id} onChange={(e) => setPlayer2Id(e.target.value) }>
                <option value="">{t('Select Player')}</option>
                {userPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.display_name}
                  </option>
                ))}
              </select>
            </label>
            <br />
              <div className="modal-actions">
                <button onClick={handleStartMatch} className="create-button">
                  {t('Start Match')}
                </button>
                <button onClick={() => setShowModal(false)} className="cancel-button">{t('Cancel')}</button>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuickPlay 