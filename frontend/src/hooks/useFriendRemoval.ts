import { useState } from 'react'
import axios from 'axios'
import { useTranslate } from './index'

export const useFriendRemoval = (onFriendRemoved?: () => void) => {
  const [removingFriend, setRemovingFriend] = useState<number | null>(null)
  const t = useTranslate()

  const handleRemoveFriend = async (friendId: number, friendName: string) => {
    if (!confirm(t('friends.confirmRemove', { username: friendName }))) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      setRemovingFriend(friendId)
      await axios.delete(`https://localhost:3001/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      // Refresh the friends list
      if (onFriendRemoved) {
        onFriendRemoved()
      }
    } catch (error) {
      console.error('Error removing friend:', error)
      alert(t('friends.errors.removeFailed'))
    } finally {
      setRemovingFriend(null)
    }
  }

  return {
    removingFriend,
    handleRemoveFriend
  }
} 