import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslate, useFriendRemoval } from '@hooks/index'
import { FriendWithDetails } from '@hooks/useFriends'
import { API_URL } from '@utils/constants'
import '@assets/styles/Profile.css'

interface User {
  id: number
  username: string
  email: string
  online_status: boolean
  avatar_url: string
  created_at: string
  two_fa_enabled: boolean
}

interface FriendListProps {
  friends: FriendWithDetails[]
  loading: boolean
  error: string | null
  isOwnProfile: boolean
  targetUser: User
  onFriendRemoved?: () => void
}

const FriendCard: React.FC<{
  friend: FriendWithDetails
  isOwnProfile: boolean
  onNavigate: (id: number) => void
  onRemove?: (id: number, name: string) => void
  isRemoving?: boolean
}> = ({ friend, isOwnProfile, onNavigate, onRemove, isRemoving }) => {
  const t = useTranslate()

  return (
    <div className="friend-card">
      <img 
        src={friend.avatar_url ? `${API_URL}${friend.avatar_url}` : '/placeholder-avatar1.png'} 
        alt={friend.username}
        className="friend-avatar"
        onClick={() => onNavigate(friend.id)}
      />
      <div className="friend-info" onClick={() => onNavigate(friend.id)}>
        <div className="friend-name">{friend.username}</div>
        <div className="friend-status">
          <span className={`status-dot ${friend.online_status ? 'online' : 'offline'}`}></span>
          {friend.online_status ? t('friends.online') : t('friends.offline')}
        </div>
      </div>
      {isOwnProfile && onRemove && (
        <button
          className="remove-friend-btn"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(friend.id, friend.username)
          }}
          disabled={isRemoving}
          title={t('friends.removeFriend')}
        >
          {isRemoving ? '...' : '×'}
        </button>
      )}
    </div>
  )
}

export const FriendList: React.FC<FriendListProps> = ({ 
  friends, 
  loading, 
  error, 
  isOwnProfile, 
  targetUser,
  onFriendRemoved 
}) => {
  const navigate = useNavigate()
  const t = useTranslate()
  const { removingFriend, handleRemoveFriend } = useFriendRemoval(onFriendRemoved)

  if (loading || error) {
    return (
      <div className="friend-list-container">
        <h3>{isOwnProfile ? t('profile.myFriends') : t('profile.friends')}</h3>
        {loading ? (
          <div className="friend-list-loading">{t('friends.loading')}</div>
        ) : (
          <div className="friend-list-error">{error}</div>
        )}
      </div>
    )
  }

  const title = isOwnProfile 
    ? t('profile.myFriends') 
    : `${targetUser.username}'s ${t('profile.friends')}`

  return (
    <>
      <h2>{title} ({friends.length})</h2>
      <div>
        {friends.length === 0 ? (
          <div className="no-friends">
            <p>{t('profile.noFriendsYet')}</p>
          </div>
        ) : (
          <div className="friend-grid">
            {friends.map(friend => (
              <FriendCard
                key={friend.id}
                friend={friend}
                isOwnProfile={isOwnProfile}
                onNavigate={(id) => navigate(`/profile/${id}`)}
                onRemove={isOwnProfile ? handleRemoveFriend : undefined}
                isRemoving={removingFriend === friend.id}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

