import { TFunction } from 'i18next'

/**
 * Formats error message from API response with translation support
 */
export const formatErrorMessage = (error: unknown, t?: TFunction): string => {
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred' 
  
  // If no translation function provided, return original message
  if (!t) return errorMessage
  
  // Simple mapping of backend messages to translation keys
  const translations: Record<string, string> = {
    "Username or email already exists": t('auth.errors.usernameOrEmailExists'),
    "Server error. Please try again later": t('auth.errors.serverError'),
    "2FA after register not supported": t('auth.errors.2faNotSupported'),
    "2FA is not set up": t('auth.errors.2faNotSetup'),
    "Invalid 2FA code": t('auth.errors.invalid2faCode'),
    "User not found": t('auth.errors.userNotFound'),
    "Internal Server Error": t('auth.errors.internalServerError'),
    "Invalid username or password": t('auth.errors.invalidCredentials'),
    "Two-factor authentication required": t('auth.errors.2faRequired'),
    "User already logged out": t('auth.errors.userAlreadyLoggedOut'),
    "Logout successful": t('auth.errors.logoutSuccessful'),
    "User created successfully": t('auth.errors.userCreatedSuccessfully'),
    "An unexpected error occurred": t('auth.errors.unexpectedError')
  }
  
  return translations[errorMessage] || errorMessage
}
