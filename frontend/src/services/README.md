# Services Directory

This directory contains API clients and external service integrations.

## Structure

```
services/
├── api/             # API clients and endpoints
└── auth/            # Authentication services
```

## Guidelines

1. **Service Organization**
   - Group by feature or domain
   - Keep services focused
   - Handle errors consistently
   - Use TypeScript types

2. **API Services**
   - Define API endpoints
   - Handle request/response
   - Manage authentication
   - Handle errors

3. **External Services**
   - Integrate third-party services
   - Handle service-specific logic
   - Manage service state
   - Provide clear interfaces 