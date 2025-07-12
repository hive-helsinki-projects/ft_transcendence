import { useState, useEffect } from 'react'
import { api } from '@services/api'

interface IncomingRequest {
  id: number
  username: string
  avatar_url: string
  online_status: boolean
}

export const useIncomingFriendRequests = (onFriendAccepted?: () => void) => {
  const [requests, setRequests] = useState<IncomingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const fetchIncomingRequests = async () => {
    try {
      setLoading(true)
      const currentUserId = parseInt(localStorage.getItem('id') || '0')
      const friendRelationships = await api.getFriends()
      
      // Get incoming pending requests
      const incomingRequests = friendRelationships
        .filter((f: any) => f.friend_id === currentUserId && f.status === 'pending')
        .map((request: any) => request.user_id)
      
      // Fetch user details for each request
      const requestDetails = await Promise.all(
        incomingRequests.map(async (userId: number) => {
          try {
            const user = await api.get(`/users/${userId}`)
            return {
              id: userId,
              username: user.username,
              avatar_url: user.avatar_url,
              online_status: user.online_status
            }
          } catch {
            return null
          }
        })
      )

      setRequests(requestDetails.filter(Boolean))
    } catch (error) {
      console.error('Error fetching friend requests:', error)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async (senderId: number, action: 'accept' | 'deny') => {
    setProcessing(true)
    
    try {
      if (action === 'accept') {
        await api.acceptFriendRequest(senderId)
        onFriendAccepted?.()
      } else {
        await api.denyFriendRequest(senderId)
      }
      
      // Remove request from list
      setRequests(prev => prev.filter(req => req.id !== senderId))
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error)
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    fetchIncomingRequests()
  }, [])

  return {
    requests,
    loading,
    processing,
    handleRequest
  }
} 