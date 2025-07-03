import { useAuth } from '@hooks/auth/useAuth'
import { api } from '@services/api'
import { API_URL } from '@utils/constants'
import { useEffect, useState } from 'react'

export const useAvatar = (userId: number | null) => {
  const [avatar, setAvatar] = useState<string>('')
  const { logout } = useAuth()

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      try {
        const user = (await api.get(`/users/${userId}`)) as {
          avatar_url: string
        }
        let url = user.avatar_url || '/placeholder-avatar1.png'
        // if it’s a relative uploads path, prefix the backend
        if (url.startsWith('/uploads/')) {
          url = `${API_URL}${url}`
        }
        setAvatar(url)
      } catch (err) {
        console.error(err)
        setAvatar('/placeholder-avatar1.png')
      }
    })()
  }, [userId])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) return
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await api.uploadAvatar(`/users/${userId}/avatar`, form)
      let newUrl = res.item.avatar_url
      if (newUrl.startsWith('/uploads/')) {
        newUrl = `${API_URL}${newUrl}`
      }
      setAvatar(newUrl)
    } catch (err) {
      console.error('Avatar upload failed', err)
    }
  }

  return { avatar, handleAvatarChange, logout }
}
