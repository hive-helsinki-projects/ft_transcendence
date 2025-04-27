import { AuthFormData } from '../types/auth'
import { API_ENDPOINTS } from '../utils/constants'
import { formatErrorMessage } from '../utils/helpers'
import { localAuth } from './localAuth'

interface LoginResponse {
  token: string
  username: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Authenticates a user with username and password
   * @param formData - User credentials
   * @returns Promise with token and username
   */
  static async login(formData: AuthFormData): Promise<LoginResponse> {
    try {
      // const response = await fetch(API_ENDPOINTS.LOGIN, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      return await localAuth.login(formData.username, formData.password) // TODO: Replace with backend API call
      // })

      // if (!response.ok) {
      //   throw new Error(formatErrorMessage(await response.json()))
      // }

      // return response.json()
    } catch (error) {
      throw new Error(formatErrorMessage(error))
    }
  }

  /**
   * Handles Google authentication
   * @returns Promise with token and username
   */
  static async googleAuth(): Promise<LoginResponse> {
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
  }

  /**
   * Registers a new user and automatically logs them in
   * @param formData - User registration data
   * @returns Promise with token and username
   */
  static async registerAndLogin(formData: AuthFormData): Promise<LoginResponse> {
    try {
      // Register the user
      await localAuth.register(
        formData.username,
        formData.email || '',
        formData.password,
      )

      // Automatically log in after successful registration
      const loginResponse = await localAuth.login(
        formData.username,
        formData.password,
      )

      return loginResponse
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Authentication failed')
    }
  }
} 