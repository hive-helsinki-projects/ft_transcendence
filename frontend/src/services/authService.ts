import { AuthFormData } from '@/types/auth'
import { BaseService } from '@services/baseService'
import { API_ENDPOINTS, API_URL } from '@utils/constants'

export interface LoginResponse {
  token: string
  username: string
  id: string
}

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
type TwoFaChallenge = { message: string; userId: number }
type SuccessLogin = { token: string; username: string; id: number }

export class AuthService extends BaseService {
  static async login(
    formData: AuthFormData,
  ): Promise<LoginResponse | TwoFaChallenge> {
    const raw = await this.post<TwoFaChallenge | SuccessLogin>(
      API_ENDPOINTS.LOGIN,
      formData,
    )

    if ('message' in raw) {
      // 206 case
      return { message: raw.message, userId: raw.userId }
    }

    // 200 case
    return {
      token: raw.token,
      username: raw.username,
      id: String(raw.id),
    }
  }

  static async login2fa(userId: number, code: string): Promise<LoginResponse> {
    const raw = await this.post<SuccessLogin>(API_ENDPOINTS.LOGIN_2FA, {
      userId,
      code,
    })
    return {
      token: raw.token,
      username: raw.username,
      id: String(raw.id),
    }
  }

  static async googleAuth(): Promise<LoginResponse> {
    const raw = await this.post<SuccessLogin>(API_ENDPOINTS.GOOGLE_AUTH)
    return {
      token: raw.token,
      username: raw.username,
      id: String(raw.id),
    }
  }

  static async registerAndLogin(
    formData: AuthFormData,
  ): Promise<LoginResponse> {
    const registerResponse = await fetch(
      API_URL + `${API_ENDPOINTS.REGISTER}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      },
    )

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
