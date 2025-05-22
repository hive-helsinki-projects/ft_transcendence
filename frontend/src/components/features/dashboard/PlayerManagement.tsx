import React, { useState } from 'react'
import { UserPlus, Edit2, Trash2 } from 'lucide-react'
import { StatusMessage } from '../auth/StatusMessage'
import { UserPlayer } from '../../../types/dashboard'
import useTranslate from '../../../hooks/useTranslate'

interface PlayerManagementProps {
  userPlayers: UserPlayer[]
  onCreatePlayer: (playerName: string) => void
  onUpdatePlayer: (playerId: string, updates: Partial<UserPlayer>) => void
  onDeletePlayer: (playerId: string) => void
}

const CreatePlayerModal: React.FC<{
  onClose: () => void
  onCreatePlayer: (playerName: string) => void
}> = ({ onClose, onCreatePlayer }) => {
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const t = useTranslate()

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
        <h3>{t('Create New Player')}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value)
                setError('')
              }}
              placeholder={t('Enter player name')}
              maxLength={20}
              required
            />
            {error && <StatusMessage type="error" message={error} />}
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
            {t('Cancel')}
            </button>
            <button type="submit" className="create-button">
            {t('Create Player')}
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
  onUpdatePlayer,
  onDeletePlayer,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const t = useTranslate()

  const handleToggleActive = (player: UserPlayer) => {
    onUpdatePlayer(player.id, { isActive: !player.isActive })
  }

  return (
    <div className="players-management">
      <div className="players-header">
        <h2>{t('Your Players')}</h2>
        <button
          className="create-player-button"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={16} />
          <span>{t('Create Player')}</span>
        </button>
      </div>
      <div className="players-list">
        {userPlayers.map((player) => (
          <div
            key={player.id}
            className={'player-item active'}
          >
            <img
              src={player.avatar_url}
              alt={`${player.display_name}'s avatar`}
              className="player-item-avatar"
            />
            <div className="player-item-info">
              <span className="player-item-name">{player.display_name}</span>
            </div>
            <div className="player-item-actions">
              <button
                className="action-button"
                onClick={() => handleToggleActive(player)}
                title="Toggle active status"
              >
                <Edit2 size={16} />
              </button>
              <button
                className="action-button delete"
                onClick={() => onDeletePlayer(player.id)}
                title="Delete player"
              >
                <Trash2 size={16} />
              </button>
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