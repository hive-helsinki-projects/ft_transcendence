import { BaseService } from './baseService'
import { AuthFormData } from '../types/auth'
import { API_ENDPOINTS } from '../utils/constants'

interface LoginResponse {
  token: string
  username: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService extends BaseService {
  static async login(formData: AuthFormData): Promise<LoginResponse> {
    return this.post<LoginResponse>(API_ENDPOINTS.LOGIN, formData)
  }

  static async googleAuth(): Promise<LoginResponse> {
    return this.post<LoginResponse>(API_ENDPOINTS.GOOGLE_AUTH)
  }

  static async registerAndLogin(formData: AuthFormData): Promise<LoginResponse> {
    await this.post('/api/auth/register', formData)
    return this.login(formData)
  }
} 