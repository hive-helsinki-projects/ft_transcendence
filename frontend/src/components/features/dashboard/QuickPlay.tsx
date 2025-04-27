import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    navigate('/game')
  }

  return (
    <div className="quick-play-section">
      <h2>Game Modes</h2>
      <div className="play-options">
        <button
          className="play-button one-vs-one"
          onClick={handleOneVsOneClick}
        >
          <span className="button-icon">🏓</span>
          1v1 Match
        </button>
        <button
          className="play-button matchmaking"
          onClick={handleTournamentClick}
          title="Tournament Mode (4-8 players)"
        >
          <span className="button-icon">🏆</span>
          Tournament Mode
          <span className="tournament-info">4-8 players</span>
        </button>
      </div>
    </div>
  )
}

export default QuickPlay 