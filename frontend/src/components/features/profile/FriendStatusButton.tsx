import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

type FriendStatus = 'none' | 'pending' | 'accepted';

interface User {
  id: number;
  username: string;
  email: string;
  online_status: boolean;
  avatar_url: string;
  created_at: string;
  two_fa_enabled: boolean;
}

interface FriendStatusButtonProps {
  user: User;
}

export const FriendStatusButton: React.FC<FriendStatusButtonProps> = ({ user }) => {
  const [friendStatus, setFriendStatus] = useState<FriendStatus>('none')
  const [sendFriendRequest, setSendFriendRequest] = useState<boolean>(false)

  useEffect(() => {
    const fetchFriendStatus = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
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
        setFriendStatus(response.data.item.status as FriendStatus)
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
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  const handleAcceptFriend = async () => {
    const token = localStorage.getItem('token')
    console.log(token)
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
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  return (
    <div>
      <div>
        {friendStatus === 'accepted' && (
          <p>
            online_status: {user.online_status === true ? 'online' : 'offline'}
          </p>
        )}
      </div>
      {friendStatus === 'accepted' && (
        <button onClick={handleRemoveFriend}>Remove Friend</button>
      )}
      {friendStatus === 'pending' && sendFriendRequest === true && (
        <button onClick={handleRemoveFriend}>Remove Friend</button>
      )}
      {friendStatus === 'pending' && sendFriendRequest === false && (
        <button onClick={handleAcceptFriend}>Accept Friend Request</button>
      )}
      {friendStatus === 'pending' && sendFriendRequest === false && (
        <button onClick={handleRemoveFriend}>Deny Friend Request</button>
      )}
      {friendStatus === 'none' && (
        <button onClick={handleAddFriend}>Add Friend</button>
      )}
    </div>
  )
}
