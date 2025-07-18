import { UserPlayer } from '@/types/dashboard'
import { StatusMessage } from '@components/features/auth/StatusMessage'
import { useTranslate } from '@hooks/index'
import { Trash2, UserPlus } from 'lucide-react'
import React, { useState } from 'react'

interface PlayerManagementProps {
  userPlayers: UserPlayer[]
  onCreatePlayer: (playerName: string) => void
  onDeletePlayer: (playerId: number) => void
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
      setError(t('Player name cannot be empty'))
      return
    }
    if (playerName.length > 20) {
      setError(t('Player name must be 20 characters or less'))
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
              maxLength={16}
              required
            />
            {error && <StatusMessage type="error" message={error} />}
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">
            {t('Create Player')}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              {t('Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  userPlayers,
  onCreatePlayer,
  onDeletePlayer,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const t = useTranslate()

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
          <div key={player.id} className={'player-item active'}>
            <img
              src={player.avatar}
              alt="Current avatar"
              className="avatar-preview"
            />
            <div className="player-item-info">
              <span className="player-item-name">{player.display_name}</span>
            </div>
            <div className="player-item-actions">
              <button
                className="action-button delete"
                onClick={() => onDeletePlayer(player.id)}
                title={t('Delete player')}
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
