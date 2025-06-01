# Shared UI Components

This directory contains reusable, presentational components that can be used throughout the application.

## Directory Structure

```
shared/
├── form/           # Form-related components (inputs, buttons, etc.)
├── feedback/       # Feedback components (loading, alerts, etc.)
├── layout/         # Layout components (containers, grids, etc.)
├── typography/     # Text-related components
├── navigation/     # Navigation components
├── data-display/   # Data presentation components
├── overlay/        # Overlay components (modals, tooltips, etc.)
└── media/          # Media-related components
```

## Component Guidelines

### 1. Props Interface
- Use TypeScript interfaces for all props
- Document all props with JSDoc comments
- Provide default props where appropriate
- Keep props interface simple and focused

### 2. Styling
- Use CSS modules or styled-components
- Support theme customization
- Ensure responsive design
- Follow accessibility guidelines

### 3. Implementation
- Keep components pure and presentational
- No business logic or API calls
- Use React.memo for performance optimization
- Implement proper error boundaries

### 4. Testing
- Write unit tests for each component
- Include accessibility tests
- Test different prop combinations
- Test edge cases

### 5. Documentation
- Include usage examples
- Document props and their types
- Add accessibility notes
- Include any special considerations

## Usage Example

```tsx
import { Button } from '@/components/shared/form/Button';

// Usage
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

## Best Practices

1. **Component Creation**
   - Create new components in appropriate category
   - Follow naming convention: PascalCase
   - Include index.ts for exports
   - Add proper TypeScript types

2. **Code Organization**
   - One component per file
   - Co-locate related files (styles, tests)
   - Use barrel exports (index.ts)

3. **Performance**
   - Implement proper memoization
   - Optimize re-renders
   - Use proper key props
   - Lazy load when appropriate

4. **Accessibility**
   - Include proper ARIA attributes
   - Ensure keyboard navigation
   - Support screen readers
   - Follow WCAG guidelines 