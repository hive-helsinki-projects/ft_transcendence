# Components Directory

This directory contains all React components organized by their purpose and reusability.

## Structure

```
components/
├── common/          # Shared UI components (Button, Input, Card, etc.)
├── layout/          # Layout components (Header, Footer, Sidebar, etc.)
├── features/        # Feature-specific components
│   ├── auth/       # Authentication components
│   └── game/       # Game-related components
└── pages/          # Page components (LandingPage, Dashboard, etc.)
```

## Guidelines

1. **Common Components**
   - Should be highly reusable
   - No business logic
   - Props-driven
   - Well-documented

2. **Layout Components**
   - Define page structure
   - Handle responsive design
   - Manage layout state

3. **Feature Components**
   - Specific to a feature
   - May contain business logic
   - Use hooks for state management

4. **Page Components**
   - Top-level route components
   - Compose feature components
   - Handle page-level state 