const API_URL = 'https://localhost:3001'

export const api = {
  async get(url: string) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async post(url: string, data: any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.status === 206) {
      return await response.json()
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`)
    }
    const data = await response.json()
    return data
  },

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || `Registration failed: ${response.status}`,
      )
    }
    const data = await response.json()
    return data
  },

  async delete(url: string) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  async put(url: string, data:any) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (response.json())
  },

  // getting 2fa status from /2fa/status
  async get2faStatus(url: string) {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}
