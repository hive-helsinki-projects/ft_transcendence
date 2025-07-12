import React from 'react'
import { useTranslate, useIncomingFriendRequests } from '@hooks/index'
import { API_URL } from '@utils/constants'
import '@assets/styles/Profile.css'

interface IncomingFriendRequestsProps {
  onFriendAccepted?: () => void
}

export const IncomingFriendRequests: React.FC<IncomingFriendRequestsProps> = ({ onFriendAccepted }) => {
  const t = useTranslate()
  const { requests, loading, processing, handleRequest } = useIncomingFriendRequests(onFriendAccepted)

  if (loading) {
    return (
      <div className="friend-list-container">
        <h3>{t('friends.incomingRequests')}</h3>
        <div className="friend-list-loading">{t('friends.loading')}</div>
      </div>
    )
  }

  if (requests.length === 0) return null

  return (
    <div className="incoming-requests">
      <h3>{t('friends.incomingRequests')} ({requests.length})</h3>
      
      <div className="requests-list">
        {requests.map(request => (
          <div key={request.id} className="request-item">
            <img 
              src={request.avatar_url ? `${API_URL}${request.avatar_url}` : '/placeholder-avatar1.png'} 
              alt={request.username}
              className="request-avatar"
            />
            <div className="request-info">
              <span className="request-name">{request.username}</span>
              <span className={`status-dot ${request.online_status ? 'online' : 'offline'}`}></span>
            </div>
            <div className="request-actions">
              <button 
                className="friend-btn accept" 
                onClick={() => handleRequest(request.id, 'accept')}
                disabled={processing}
                title={t('friends.accept')}
              >
                {processing ? '...' : '✓'}
              </button>
              <button 
                className="friend-btn deny" 
                onClick={() => handleRequest(request.id, 'deny')}
                disabled={processing}
                title={t('friends.deny')}
              >
                {processing ? '...' : '×'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 