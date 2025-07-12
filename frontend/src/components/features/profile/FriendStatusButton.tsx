import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import '@assets/styles/FriendStatusButton.css';
import { useTranslate } from '@hooks/index';

interface User {
  id: number;
  username: string;
  online_status: boolean;
}

interface FriendStatusButtonProps {
  user: User;
}

export const FriendStatusButton: React.FC<FriendStatusButtonProps> = ({ user }) => {
  const [friendStatus, setFriendStatus] = useState('none')
  const [sendFriendRequest, setSendFriendRequest] = useState(false)
  const [loading, setLoading] = useState(true)
  const t = useTranslate()

  useEffect(() => {
    const fetchFriendStatus = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `https://localhost:3001/friends/${user.id}/status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        setFriendStatus(response.data.item.status)
        if (
          response.data.item.status === 'pending' &&
          response.data.item.friend_id === user.id
        ) {
          setSendFriendRequest(true)
        }
      } catch (error) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response && axiosError.response.status === 404) {
          setFriendStatus('none');
          setSendFriendRequest(false);
        } else {
          console.error('Error fetching friend status:', axiosError);
        }
      } finally {
        setLoading(false)
      }
    }
    fetchFriendStatus()
  }, [user.id])

  const handleAddFriend = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
        await axios.post(
        `https://localhost:3001/friend-requests/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setFriendStatus('pending')
      setSendFriendRequest(true)
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const handleRemoveFriend = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await axios.delete(`https://localhost:3001/friends/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setFriendStatus('none')
      setSendFriendRequest(false)
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const handleAcceptFriend = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await axios.patch(
        `https://localhost:3001/friend-requests/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setFriendStatus('accepted')
      setSendFriendRequest(false)
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  if (loading) {
    return (
      <div className="friend-status-container">
        <div className="friend-status-loading">{t('friends.loading')}</div>
      </div>
    )
  }

  return (
    <div className="friend-status-container">
      <div className="friend-status-info">
        {friendStatus === 'accepted' && (
          <div className="friend-info">
            <div className="friend-badge">{t('friends.friends')}</div>
            <div className="online-status">
              <span className={`status-dot ${user.online_status ? 'online' : 'offline'}`}></span>
              {user.online_status ? t('friends.online') : t('friends.offline')}
            </div>
          </div>
        )}
        
        {friendStatus === 'pending' && sendFriendRequest && (
          <div className="friend-info">
            <div className="friend-badge pending">{t('friends.requestSent')}</div>
            <p>{t('friends.waitingAccept', { username: user.username })}</p>
          </div>
        )}
        
        {friendStatus === 'pending' && !sendFriendRequest && (
          <div className="friend-info">
            <div className="friend-badge incoming">{t('friends.requestReceived')}</div>
            <p>{t('friends.wantsToBeFriend', { username: user.username })}</p>
          </div>
        )}
        
        {friendStatus === 'none' && (
          <div className="friend-info">
            <div className="friend-badge none">{t('friends.notFriends')}</div>
            <p>{t('friends.sendRequest')}</p>
          </div>
        )}
      </div>
      
      <div className="friend-actions">
        {friendStatus === 'accepted' && (
          <button className="friend-btn remove" onClick={handleRemoveFriend}>
            {t('friends.removeFriend')}
          </button>
        )}
        
        {friendStatus === 'pending' && sendFriendRequest && (
          <button className="friend-btn cancel" onClick={handleRemoveFriend}>
            {t('friends.cancelRequest')}
          </button>
        )}
        
        {friendStatus === 'pending' && !sendFriendRequest && (
          <div className="friend-btn-group">
            <button className="friend-btn accept" onClick={handleAcceptFriend}>
              {t('friends.accept')}
            </button>
            <button className="friend-btn deny" onClick={handleRemoveFriend}>
              {t('friends.deny')}
            </button>
          </div>
        )}
        
        {friendStatus === 'none' && (
          <button className="friend-btn add" onClick={handleAddFriend}>
            {t('friends.addFriend')}
          </button>
        )}
      </div>
    </div>
  )
}
