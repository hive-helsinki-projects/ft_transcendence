import { useState, useEffect } from 'react'

export const useAvatar = (username: string) => {
  const [avatar, setAvatar] = useState('')

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar')
    if (savedAvatar) {
      setAvatar(savedAvatar)
    } else {
      const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&size=100`
      setAvatar(randomAvatar)
      localStorage.setItem('avatar', randomAvatar)
    }
  }, [username])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newAvatar = reader.result as string
        setAvatar(newAvatar)
        localStorage.setItem('avatar', newAvatar)
      }
      reader.readAsDataURL(file)
    }
  }

  return { avatar, handleAvatarChange }
} 