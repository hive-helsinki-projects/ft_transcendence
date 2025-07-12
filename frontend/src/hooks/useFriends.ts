import { useState, useEffect } from 'react'
import axios from 'axios'

interface Friend {
  user_id: number
  friend_id: number
  status: string
}

interface FriendWithDetails {
  id: number
  username: string
  avatar_url: string
  online_status: boolean
  friendshipStatus: string
}

export const useFriends = () => {
  const [friends, setFriends] = useState<FriendWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFriends = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('token')
      const currentUserId = parseInt(localStorage.getItem('id') || '0')
      
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Get friend relationships
      const friendsResponse = await axios.get('https://localhost:3001/friends', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const friendRelationships: Friend[] = friendsResponse.data
      
      // Filter for accepted friends only
      const acceptedFriends = friendRelationships.filter(f => f.status === 'accepted')
      
      // Get friend details for each accepted friend
      const friendsWithDetails = await Promise.all(
        acceptedFriends.map(async (friendship) => {
          // Determine which ID is the friend (not current user)
          const friendId = friendship.user_id === currentUserId 
            ? friendship.friend_id 
            : friendship.user_id
          
          try {
            // Get friend's user details
            const userResponse = await axios.get(`https://localhost:3001/users/${friendId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            
            return {
              id: friendId,
              username: userResponse.data.username,
              avatar_url: userResponse.data.avatar_url,
              online_status: userResponse.data.online_status,
              friendshipStatus: friendship.status
            }
          } catch (err) {
            console.error(`Error fetching details for friend ${friendId}:`, err)
            return null
          }
        })
      )

      // Filter out any failed requests
      const validFriends = friendsWithDetails.filter(f => f !== null) as FriendWithDetails[]
      setFriends(validFriends)
      
    } catch (err) {
      console.error('Error fetching friends:', err)
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        // No friends found - not an error, just empty list
        setFriends([])
      } else {
        setError('Failed to load friends')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFriends()
  }, [])

  return {
    friends,
    loading,
    error,
    refetch: fetchFriends
  }
} 