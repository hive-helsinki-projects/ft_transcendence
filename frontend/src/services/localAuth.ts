export interface User {
  username: string
  email: string
  password: string
}

const STORAGE_KEY = 'ft_transcendence_users'

export const localAuth = {
  register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

        // Check if user already exists
        if (
          users.some(
            (user: User) => user.username === username || user.email === email,
          )
        ) {
          reject(new Error('Username or email already exists'))
          return
        }

        // Add new user
        users.push({ username, email, password })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

        resolve({ message: 'User registered successfully' })
      } catch (error) {
        reject(error)
      }
    })
  },

  login(
    username: string,
    password: string,
  ): Promise<{ token: string; username: string }> {
    return new Promise((resolve, reject) => {
      try {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        const user = users.find(
          (u: User) => u.username === username && u.password === password,
        )

        if (!user) {
          reject(new Error('Invalid username or password'))
          return
        }

        // Generate a simple token (in production, use JWT)
        const token = btoa(`${username}:${Date.now()}`)
        resolve({ token, username })
      } catch (error) {
        reject(error)
      }
    })
  },
}
