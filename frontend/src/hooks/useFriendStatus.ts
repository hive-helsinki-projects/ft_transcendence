import { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import { useTranslate } from './index'

interface User {
  id: number
  username: string
  online_status: boolean
}

export const useFriendStatus = (user: User) => {
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
        const axiosError = error as AxiosError
  
        if (axiosError.response && axiosError.response.status === 404) {
          // 404 is expected when no friend relationship exists
          setFriendStatus('none')
          setSendFriendRequest(false)
        } else {
          console.error('Error fetching friend status:', axiosError)
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
            'Content-Type': 'application/json',
          },
        },
      )
      setFriendStatus('pending')
      setSendFriendRequest(true)
      alert(t('friends.requestSentAlert', { username: user.username }))
    } catch (error) {
      console.error('Error sending friend request:', error)
      
      const axiosError = error as AxiosError
      let errorMessage = t('friends.errors.sendFailed')
      
      if (axiosError.response) {
        switch (axiosError.response.status) {
          case 400: {
            const errorData = axiosError.response.data as { error: string }
            if (errorData.error === 'Already friends') {
              errorMessage = t('friends.errors.alreadyFriends')
            } else if (errorData.error === 'Cannot send friend request to yourself') {
              errorMessage = t('friends.errors.cannotAddSelf')
            }
            break
          }
          case 409:
            errorMessage = t('friends.errors.requestExists')
            break
          case 500:
            errorMessage = t('friends.errors.userNotFound')
            break
        }
      }
      
      alert(errorMessage)
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

  return {
    friendStatus,
    sendFriendRequest,
    loading,
    handleAddFriend,
    handleRemoveFriend,
    handleAcceptFriend
  }
} 