import React from 'react'
import '@assets/styles/Profile.css'
import { useTranslate, useFriendStatus, useFriendRemoval } from '@hooks/index'

interface User {
  id: number
  username: string
  online_status: boolean
}

interface FriendStatusButtonProps {
  user: User
}

export const FriendStatusButton: React.FC<FriendStatusButtonProps> = ({ user }) => {
  const t = useTranslate()
  const { friendStatus, sendFriendRequest, loading, handleAddFriend, handleRemoveFriend, handleAcceptFriend } = useFriendStatus(user)
  const { handleRemoveFriend: handleRemoveFriendWithConfirm } = useFriendRemoval(() => {
    // After successful removal, update the friend status
    handleRemoveFriend()
  })

  const handleRemoveAcceptedFriend = () => {
    handleRemoveFriendWithConfirm(user.id, user.username)
  }

  const handleCancelFriendRequest = () => {
    if (!confirm(t('friends.confirmCancelRequest', { username: user.username }))) {
      return
    }
    handleRemoveFriend()
  }

  const handleDenyFriendRequest = () => {
    if (!confirm(t('friends.confirmDenyRequest', { username: user.username }))) {
      return
    }
    handleRemoveFriend()
  }

  if (loading) {
    return (
      <div className="friend-status">
        <div className="friend-status-loading">{t('friends.loading')}</div>
      </div>
    )
  }

  return (
    <div className="friend-status">
      {friendStatus === 'accepted' && (
        <div className="friend-status-layout">
          <span className={`status-dot ${user.online_status ? 'online' : 'offline'}`}></span>
          <span className="friend-label">{t('friends.friends')}</span>
          <button 
            className="remove-friend-btn" 
            onClick={handleRemoveAcceptedFriend}
            title={t('friends.removeFriend')}
          >
            ×
          </button>
        </div>
      )}
      
      {friendStatus === 'pending' && sendFriendRequest && (
        <div className="friend-status-layout">
          <span className="friend-label pending">{t('friends.requestSent')}</span>
          <button 
            className="friend-btn cancel" 
            onClick={handleCancelFriendRequest}
            title={t('friends.cancelRequest')}
          >
            ×
          </button>
        </div>
      )}
      
      {friendStatus === 'pending' && !sendFriendRequest && (
        <div className="friend-status-layout">
          <span className="friend-label incoming">{t('friends.requestReceived')}</span>
          <div className="minimal-btn-group">
            <button 
              className="friend-btn accept" 
              onClick={handleAcceptFriend}
              title={t('friends.accept')}
            >
              ✓
            </button>
            <button 
              className="friend-btn deny" 
              onClick={handleDenyFriendRequest}
              title={t('friends.deny')}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {friendStatus === 'none' && (
        <div>
          <button 
            className="friend-btn add text-btn" 
            onClick={handleAddFriend}
            title={t('friends.addFriend')}
          >
            {t('friends.addFriend')}
          </button>
        </div>
      )}
    </div>
  )
}
