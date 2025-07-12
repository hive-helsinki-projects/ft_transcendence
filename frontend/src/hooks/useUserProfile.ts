import { useState, useEffect } from 'react'
import { useTranslate } from './index'
import { api } from '@services/api'

interface User {
  id: number
  username: string
  email: string
  online_status: boolean
  avatar_url: string
  created_at: string
  two_fa_enabled: boolean
}

export const useUserProfile = (profileId?: string) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslate()

  const currentUserId = localStorage.getItem('id')
  const isOwnProfile = !profileId || profileId === currentUserId

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const userId = profileId || currentUserId
        if (!userId) {
          setError(t('profile.errorProfile'))
          return
        }
        
        const response = await api.get(`/users/${userId}`)
        setUser(response)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        setError(t('profile.errorProfile'))
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [profileId, currentUserId, t])

  return {
    user,
    loading,
    error,
    isOwnProfile
  }
} 