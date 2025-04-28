# Landing Page Components

This directory contains components specific to the landing page of the application.

## Components Structure

```
components/landing/
├── LandingPage.tsx      # Main landing page component
├── HeroSection.tsx      # Hero section with main message
└── README.md           # This documentation
```

## Component Descriptions

### LandingPage.tsx
- Main entry point for unauthenticated users
- Integrates HeroSection and AuthSection
- Handles authentication flow and navigation
- Manages authentication state and form submission

### HeroSection.tsx
- Displays the main hero message
- Contains the game's value proposition
- Provides visual appeal and branding

## Component Dependencies

- `components/auth/AuthForm.tsx`
- `components/auth/AuthSection.tsx`
- `hooks/useAuth.ts`
- `hooks/useAuthForm.ts`
- `hooks/useFormValidation.ts`
- `services/authService.ts`

## Usage Example

```tsx
import { LandingPage } from './components/landing'

// In your router
<Route path="/" element={<LandingPage />} />
```

## State Management

The landing page uses several hooks for state management:
- `useAuth`: Manages authentication state
- `useAuthForm`: Handles form state and validation
- `useNavigate`: Handles navigation
- `useFormValidation`: Handles form validation

## Authentication Flow

1. User enters credentials in AuthForm
2. Form data is validated
3. AuthService handles the API call
4. On success:
   - User is authenticated
   - Success message is shown
   - Redirect to dashboard after delay
5. On error:
   - Error message is displayed
   - User can try again 