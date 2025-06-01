# Utils Structure

This directory contains utility functions and helpers used throughout the application.

## Directory Structure

```
utils/
├── constants/         # Application constants
│   └── constants.ts
├── validation/        # Validation utilities
│   └── validation.ts
└── helpers/          # General helper functions
    └── helpers.ts
```

## Utility Guidelines

1. **Organization**
   - Group utilities by functionality
   - Keep functions pure and predictable
   - Use TypeScript for type safety

2. **Implementation**
   - Keep functions small and focused
   - Document function parameters and return values
   - Handle edge cases appropriately
   - Use proper error handling

3. **Best Practices**
   - Write unit tests for utilities
   - Keep utilities framework-agnostic
   - Document complex logic
   - Use proper naming conventions 