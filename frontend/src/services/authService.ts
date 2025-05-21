import { BaseService } from './baseService'
import { AuthFormData } from '../types/auth'
import { API_ENDPOINTS } from '../utils/constants'

export interface LoginResponse {
  token: string
  username: string
}

const API_URL = 'https://localhost:3001'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService extends BaseService {
  static async login(formData: AuthFormData): Promise<LoginResponse | { message: string, userId: number }> {
    return this.post<LoginResponse>(API_ENDPOINTS.LOGIN, formData)
  }

  static async login2fa(userId: number, code: string): Promise<LoginResponse> {
    return this.post<LoginResponse>(API_ENDPOINTS.LOGIN_2FA, { userId, code })
  }

  static async googleAuth(): Promise<LoginResponse> {
    return this.post<LoginResponse>(API_ENDPOINTS.GOOGLE_AUTH)
  }

  static async registerAndLogin(formData: AuthFormData): Promise<LoginResponse> {
    const registerResponse = await fetch(API_URL+`${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
  
    if (registerResponse.status === 409) {
      const data = await registerResponse.json()
      throw new Error(data.error || 'Username or email already exists')
    }
  
    if (!registerResponse.ok) {
      throw new Error('Server error. Please try again later')
    }
  
    // Registration was successful, now try login
    const result = await this.login(formData)
  
    if ('token' in result) return result
  
    throw new Error('2FA after register not supported')
  }
} 