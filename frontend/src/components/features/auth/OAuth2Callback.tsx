import { useAuth } from '@hooks/auth/useAuth'
import { API_URL } from '@utils/constants'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const OAuth2Callback = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      return
    }

    fetch(`${API_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.token) {
          login(data.user.token, data.user.username, data.user.id)
          navigate('/dashboard')
        } else {
          console.error('Failed to login:', data)
          navigate('/')
        }
      })
      .catch((err) => {
        console.error('Error:', err)
        navigate('/')
      })
  }, [navigate, login])

  return <p>Logging in...</p>
}
