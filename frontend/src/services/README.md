# Services Documentation

## Directory Structure

```
services/
├── api.ts            # Main API client configuration
├── authService.ts    # Authentication service
├── localAuth.ts      # Local authentication utilities
└── helpData.ts       # Help documentation data
```

## Service Overview

### 1. API Client (`api.ts`)
- Centralized API client configuration
- Axios instance setup
- Request/response interceptors
- Error handling
- Base URL configuration

### 2. Authentication Service (`authService.ts`)
- User authentication endpoints
- Token management
- Session handling
- Login/Logout functionality
- User registration

### 3. Local Authentication (`localAuth.ts`)
- Local storage utilities
- Token persistence
- Session state management
- Authentication state helpers

### 4. Help Data Service (`helpData.ts`)
- Static help documentation
- FAQ content
- Game rules
- User guide information

## Service Usage Guidelines

1. **API Calls**:
   - Use the configured API client for all HTTP requests
   - Implement proper error handling
   - Use TypeScript interfaces for request/response types
   - Follow RESTful conventions

2. **Authentication**:
   - Use authService for all authentication-related operations
   - Implement proper token refresh logic
   - Handle session expiration
   - Secure token storage

3. **Local Storage**:
   - Use localAuth utilities for persistent storage
   - Implement proper data encryption when needed
   - Handle storage errors gracefully
   - Clear sensitive data on logout

4. **Error Handling**:
   - Implement consistent error handling
   - Use appropriate error types
   - Provide meaningful error messages
   - Log errors appropriately

## Best Practices

1. **Service Organization**:
   - Keep services focused and single-responsibility
   - Use TypeScript for type safety
   - Document service interfaces
   - Implement proper error handling

2. **API Integration**:
   - Use consistent endpoint naming
   - Implement proper request/response types
   - Handle network errors
   - Implement retry logic when appropriate

3. **Authentication**:
   - Secure token storage
   - Implement proper session management
   - Handle token refresh
   - Clear sensitive data appropriately

4. **Data Management**:
   - Use proper data structures
   - Implement data validation
   - Handle data transformation
   - Cache data when appropriate

## Example Usage

```typescript
// API call example
import { api } from './api';

const fetchUserData = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Authentication example
import { authService } from './authService';

const login = async (credentials: LoginCredentials) => {
  try {
    const response = await authService.login(credentials);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
}; 