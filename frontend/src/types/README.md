# Types Structure

This directory contains TypeScript type definitions and interfaces used throughout the application.

## Directory Structure

```
types/
├── auth/              # Authentication related types
│   └── auth.ts
├── game/              # Game related types
│   └── match.ts
├── form/              # Form related types
│   └── form.ts
├── dashboard/         # Dashboard related types
│   └── dashboard.ts
└── styles/           # Style related types
    └── css.d.ts
```

## Type Guidelines

1. **Organization**
   - Group types by feature/domain
   - Keep types focused and specific
   - Use proper TypeScript features

2. **Naming**
   - Use PascalCase for interfaces and types
   - Use descriptive names
   - Follow TypeScript naming conventions

3. **Implementation**
   - Use proper TypeScript features
   - Document complex types
   - Use proper type exports
   - Keep types DRY

4. **Best Practices**
   - Use interfaces for objects
   - Use type aliases for unions/intersections
   - Document complex type structures
   - Keep types maintainable 