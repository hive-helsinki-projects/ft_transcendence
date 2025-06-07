/**
 * Token Service
 * Centralized token management utilities
 */

export class TokenService {
  private static readonly TOKEN_KEY = 'token'
  private static readonly USERNAME_KEY = 'username'
  private static readonly ID_KEY = 'id'

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY)
  }

  static getId(): string | null {
    return localStorage.getItem(this.ID_KEY)
  }

  static setTokenData(token: string, username: string, id: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
    localStorage.setItem(this.USERNAME_KEY, username)
    localStorage.setItem(this.ID_KEY, id)
  }

  static clearTokenData(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USERNAME_KEY)
    localStorage.removeItem(this.ID_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static getAuthHeader(): string | null {
    const token = this.getToken()
    return token ? `Bearer ${token}` : null
  }
} 