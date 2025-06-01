# Hooks Structure

This directory contains all custom React hooks organized by feature and functionality.

## Directory Structure

```
hooks/
├── auth/              # Authentication related hooks
│   └── useAuth.ts
├── game/              # Game related hooks
│   ├── useUserPlayers.ts
│   └── useMatchHistories.ts
├── form/              # Form related hooks
│   └── useRegisterForm.ts
├── ui/                # UI related hooks
│   └── useAvatar.ts
└── i18n/              # Internationalization hooks
    └── useTranslate.ts
```

## Hook Guidelines

1. **Organization**
   - Group hooks by feature/functionality
   - Keep hooks focused and single-purpose
   - Use TypeScript for type safety

2. **Naming**
   - Use 'use' prefix for all hooks
   - Name should clearly indicate hook's purpose
   - Follow React hook naming conventions

3. **Implementation**
   - Keep hooks pure and predictable
   - Handle errors appropriately
   - Document dependencies and side effects
   - Use proper cleanup in useEffect

4. **Best Practices**
   - Keep hooks small and focused
   - Implement proper error handling
   - Document hook parameters and return values
   - Test hooks thoroughly

## Hook Overview

### 1. Authentication Hooks (`auth/`)
- **useAuth**: Manages authentication state and user session
  - Handles login/logout
  - Manages user context
  - Provides authentication status
  - Handles token management

- **useAuthForm**: Form handling for authentication
  - Manages form state
  - Handles form submission
  - Provides validation
  - Manages loading states

- **useFormValidation**: Form validation utilities
  - Input validation
  - Error handling
  - Form state management
  - Validation rules

## Hook Usage Guidelines

1. **Authentication Hooks**:
   - Use `useAuth` for authentication state
   - Implement proper error handling
   - Handle loading states
   - Manage session persistence

2. **Form Hooks**:
   - Use `useAuthForm` for authentication forms
   - Implement proper validation
   - Handle form submission
   - Manage form state

3. **Validation Hooks**:
   - Use `useFormValidation` for input validation
   - Implement custom validation rules
   - Handle validation errors
   - Provide feedback

## Best Practices

1. **Hook Organization**:
   - Keep hooks focused and single-responsibility
   - Use TypeScript for type safety
   - Document hook interfaces
   - Implement proper error handling

2. **State Management**:
   - Use appropriate state management
   - Handle side effects properly
   - Implement cleanup
   - Manage dependencies

3. **Performance**:
   - Optimize re-renders
   - Use proper memoization
   - Handle large data sets
   - Implement proper cleanup

4. **Error Handling**:
   - Implement proper error boundaries
   - Provide meaningful error messages
   - Handle edge cases
   - Log errors appropriately

## Example Usage

```typescript
// Authentication hook example
import { useAuth } from './auth/useAuth';

const LoginComponent = () => {
  const { login, logout, user, isLoading } = useAuth();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Handle successful login
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Component JSX
  );
};

// Form hook example
import { useAuthForm } from './auth/useAuthForm';

const AuthForm = () => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useAuthForm({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async (values) => {
      // Handle form submission
    }
  });

  return (
    // Form JSX
  );
};
``` 