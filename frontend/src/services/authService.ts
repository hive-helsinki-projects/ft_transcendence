import { AuthFormData } from '../types/auth'
import { API_ENDPOINTS } from '../utils/constants'
import { formatErrorMessage } from '../utils/helpers'

interface LoginResponse {
  token: string
  username: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const AuthService = {
  /**
   * Authenticates a user with username and password
   * @param formData - User credentials
   * @returns Promise with token and username
   */
  login: async (formData: AuthFormData): Promise<LoginResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(formatErrorMessage(await response.json()))
      }

      return response.json()
    } catch (error) {
      throw new Error(formatErrorMessage(error))
    }
  },

  /**
   * Handles Google authentication
   * @returns Promise with token and username
   */
  googleAuth: async (): Promise<LoginResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.GOOGLE_AUTH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(formatErrorMessage(await response.json()))
      }

      return response.json()
    } catch (error) {
      throw new Error(formatErrorMessage(error))
    }
  },
} 