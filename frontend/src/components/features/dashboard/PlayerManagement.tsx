import React, { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { StatusMessage } from '../auth/StatusMessage'

interface UserPlayer {
  id: string
  name: string
  avatar: string
  isActive: boolean
  points: number
}

interface PlayerManagementProps {
  userPlayers: UserPlayer[]
  onCreatePlayer: (playerName: string) => void
}

const CreatePlayerModal: React.FC<{
  onClose: () => void
  onCreatePlayer: (playerName: string) => void
}> = ({ onClose, onCreatePlayer }) => {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) {
      setError('Player name cannot be empty')
      return
    }
    if (playerName.length > 20) {
      setError('Player name must be 20 characters or less')
      return
    }
    onCreatePlayer(playerName.trim())
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Player</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value)
                setError('')
              }}
              placeholder="Enter player name"
              maxLength={20}
              required
            />
            {error && <StatusMessage type="error" message={error} />}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create Player
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({
  userPlayers,
  onCreatePlayer,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="players-management">
      <div className="players-header">
        <h2>Your Players</h2>
        <button
          className="create-player-button"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={16} />
          <span>Create Player</span>
        </button>
      </div>
      <div className="players-list">
        {userPlayers.map((player) => (
          <div
            key={player.id}
            className={`player-item ${player.isActive ? 'active' : ''}`}
          >
            <img
              src={player.avatar}
              alt={`${player.name}'s avatar`}
              className="player-item-avatar"
            />
            <div className="player-item-info">
              <span className="player-item-name">{player.name}</span>
              <span className="player-item-points">
                {player.points} points
              </span>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreatePlayerModal
          onClose={() => setShowCreateModal(false)}
          onCreatePlayer={onCreatePlayer}
        />
      )}
    </div>
  )
}

export default PlayerManagement 