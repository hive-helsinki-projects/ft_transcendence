# Pages Structure

This directory contains all page-level components that represent full pages in the application.

## Directory Structure

```
pages/
├── auth/              # Authentication pages
│   ├── Register.tsx
│   └── Login.tsx
├── dashboard/         # Dashboard related pages
│   └── DashBoard.tsx
├── game/             # Game related pages
│   └── Tournament.tsx
├── settings/         # Settings pages
│   └── Settings.tsx
├── help/             # Help and documentation
│   └── Help.tsx
└── landing/          # Landing page components
```

## Page Guidelines

1. **Organization**
   - Group related pages in subdirectories
   - Keep page components focused on layout and composition
   - Use feature components for specific functionality

2. **Structure**
   - Each page should be a composition of components
   - Keep business logic in hooks or services
   - Use shared components for common UI elements

3. **Best Practices**
   - Keep pages clean and focused on layout
   - Use proper loading states
   - Implement error boundaries
   - Handle routing logic appropriately 