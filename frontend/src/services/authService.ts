import { localAuth } from './localAuth'
import { AuthFormData } from '../types/auth'

export class AuthService {
  static async login(formData: AuthFormData) {
    return localAuth.login(formData.username, formData.password)
  }

  static async register(formData: AuthFormData & { email: string }) {
    return localAuth.register(formData.username, formData.email, formData.password)
  }
} 