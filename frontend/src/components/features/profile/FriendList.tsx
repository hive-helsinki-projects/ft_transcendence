import React from 'react'
import { useFriends } from '@hooks/useFriends'
import { useNavigate } from 'react-router-dom'
import '@assets/styles/FriendList.css'

export const FriendList: React.FC = () => {
  const { friends, loading, error } = useFriends()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="friend-list-container">
        <h2>My Friends</h2>
        <div className="friend-list-loading">Loading friends...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="friend-list-container">
        <h2>My Friends</h2>
        <div className="friend-list-error">{error}</div>
      </div>
    )
  }

  return (
    <div className="friend-list-container">
      <h3>My Friends ({friends.length})</h3>
      
      {friends.length === 0 ? (
        <div className="no-friends">
          <p>No friends yet. Use the search bar to find and add friends!</p>
        </div>
      ) : (
        <div className="friend-grid">
          {friends.map(friend => (
            <div 
              key={friend.id} 
              className="friend-card"
              onClick={() => navigate(`/profile/${friend.id}`)}
            >
              <img 
                src={friend.avatar_url ? `https://localhost:3001${friend.avatar_url}` : '/placeholder-avatar1.png'} 
                alt={friend.username}
                className="friend-avatar"
              />
              <div className="friend-info">
                <div className="friend-name">{friend.username}</div>
                <div className="friend-status">
                  <span className={`status-dot ${friend.online_status ? 'online' : 'offline'}`}></span>
                  {friend.online_status ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

