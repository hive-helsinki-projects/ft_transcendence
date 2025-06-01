# Components Structure

This directory contains all React components organized in a simple, maintainable structure.

## Directory Structure

```
components/
├── shared/           # Reusable UI components
│   ├── form/        # Form components (inputs, buttons)
│   ├── layout/      # Layout components (containers, grids)
│   ├── feedback/    # Loading, alerts, messages
│   └── ui/          # Basic UI elements
├── features/        # Feature-specific components
│   ├── auth/        # Authentication components
│   ├── game/        # Game components
│   └── profile/     # Profile components
└── layout/          # Main layout components
```

## Component Guidelines

1. **Naming**
   - Use PascalCase for component files
   - Name should clearly indicate component's purpose
   - Use .tsx extension for React components

2. **Organization**
   - Place shared/reusable components in `shared/`
   - Place feature-specific components in `features/`
   - Keep components small and focused
   - One component per file

3. **Props**
   - Use TypeScript interfaces for props
   - Document required props
   - Provide default values when appropriate

4. **Styling**
   - Use Tailwind CSS
   - Keep styles modular
   - Follow responsive design

5. **Best Practices**
   - Use functional components
   - Implement proper error handling
   - Keep business logic in hooks or services
   - Write clear, self-documenting code 