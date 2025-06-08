# Component Migration Guide

This guide provides step-by-step instructions for migrating from the old component structure to the new, cleaner architecture.

## Quick Migration Examples

### 1. Loading Components

**Before** (Using separate components):
```tsx
import LoadingState from './LoadingState'
import LoadingContainer from './LoadingContainer'

// Multiple different loading implementations
<LoadingState message="Loading..." />
<LoadingContainer showPongBackground={true}>
  <div>Content</div>
</LoadingContainer>
```

**After** (Unified Loading component):
```tsx
import { Loading, LoadingOverlay } from '@/components/ui'

// Consistent loading API
<Loading variant="spinner" message="Loading..." />
<Loading variant="dots" size="lg" />
<LoadingOverlay message="Processing..." />
```

### 2. Form Components

**Before**:
```tsx
import { FormField } from './FormField'
import SearchBar from './SearchBar'

<FormField
  name="username"
  type="text"
  placeholder="Username"
  value={username}
  onChange={handleChange}
  disabled={isLoading}
/>

<SearchBar onSearch={handleSearch} />
```

**After**:
```tsx
import { Input, SearchBar } from '@/components/ui'

<Input
  name="username"
  label="Username"
  placeholder="Enter your username"
  value={username}
  onChange={handleChange}
  disabled={isLoading}
  error={errors.username}
/>

<SearchBar 
  onSearch={handleSearch}
  placeholder="Search..."
  autoSubmit
  debounceMs={300}
/>
```

### 3. Button Components

**Before** (Custom implementations):
```tsx
// Custom button with loading state
<button 
  className="submit-button"
  disabled={isLoading || !validation.isValid}
>
  {isLoading ? <LoadingState size="small" /> : 'Sign In'}
</button>
```

**After** (Standardized Button):
```tsx
import { Button } from '@/components/ui'

<Button
  variant="primary"
  size="md"
  isLoading={isLoading}
  loadingText="Signing in..."
  disabled={!validation.isValid}
>
  Sign In
</Button>
```

## Component-by-Component Migration

### AuthForm.tsx Migration

**Current AuthForm** issues:
- Directly imports LoadingState
- Inconsistent form field handling
- Mixed UI and business logic

**Migration steps**:

1. **Update imports**:
```tsx
// Before
import LoadingState from '../../LoadingState'

// After  
import { Loading, Button, Input, Alert } from '@/components/ui'
```

2. **Replace form inputs**:
```tsx
// Before
<FormInput
  key={field.name}
  name={field.name}
  type={field.type}
  value={formData[field.name]}
  error={validation.errors[field.name]}
  disabled={isLoading}
  onChange={handleInputChange}
/>

// After
<Input
  key={field.name}
  name={field.name}
  type={field.type}
  value={formData[field.name]}
  error={validation.errors[field.name]}
  disabled={isLoading}
  onChange={handleInputChange}
  label={field.label}
/>
```

3. **Replace button**:
```tsx
// Before
<button
  type="submit"
  className="submit-button"
  disabled={isLoading || !validation.isValid}
>
  {isLoading ? <LoadingState size="small" message="Signing in..." /> : 'Sign In'}
</button>

// After
<Button
  type="submit"
  variant="primary"
  isLoading={isLoading}
  loadingText="Signing in..."
  disabled={!validation.isValid}
>
  Sign In
</Button>
```

4. **Replace status messages**:
```tsx
// Before
{error && <StatusMessage type="error" message={error} />}
{successMessage && <StatusMessage type="success" message={successMessage} />}

// After
{error && <Alert variant="error" message={error} />}
{successMessage && <Alert variant="success" message={successMessage} />}
```

### SearchBar Migration

**Before** (basic implementation):
```tsx
// SearchBar.tsx
const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  )
}
```

**After** (enhanced implementation):
```tsx
// Already available in ui/SearchBar.tsx with:
// - Auto-submit with debouncing
// - Clear functionality
// - Icons
// - Size variants
// - Better UX

import { SearchBar, AutoSearchBar, CompactSearchBar } from '@/components/ui'

// Basic usage
<SearchBar onSearch={handleSearch} />

// Auto-submit without button
<AutoSearchBar onSearch={handleSearch} debounceMs={500} />

// Compact version
<CompactSearchBar onSearch={handleSearch} />
```

## Step-by-Step Migration Process

### Step 1: Install New Components

The new UI components are already created in `/ui/` directory. No installation needed.

### Step 2: Update Imports

Replace old component imports with new UI component imports:

```tsx
// Update this
import LoadingState from './LoadingState'
import LoadingContainer from './LoadingContainer'  
import SearchBar from './SearchBar'
import { FormField } from './FormField'

// To this
import { 
  Loading, 
  LoadingOverlay,
  SearchBar, 
  AutoSearchBar,
  Input,
  Button,
  Alert,
  Card
} from '@/components/ui'
```

### Step 3: Replace Component Usage

Update component usage to use new props and patterns:

```tsx
// Old patterns
<LoadingState message="Loading..." />
<FormField name="email" type="email" value={email} onChange={setEmail} />

// New patterns  
<Loading variant="spinner" message="Loading..." />
<Input name="email" type="email" value={email} onChange={setEmail} label="Email" />
```

### Step 4: Update Feature Components

For complex components like AuthForm:

1. Keep business logic
2. Replace UI components with new ones
3. Update prop interfaces if needed
4. Test thoroughly

### Step 5: Test and Validate

- Visual testing: Ensure UI looks correct
- Functional testing: Ensure behavior is unchanged
- Accessibility testing: Check keyboard navigation and screen readers
- Performance testing: Check bundle size impact

## Common Migration Patterns

### Pattern 1: Loading States

```tsx
// Before - Multiple loading components
{isLoading && <LoadingState />}
{showOverlay && <LoadingContainer><Content /></LoadingContainer>}

// After - Unified loading
{isLoading && <Loading variant="spinner" />}
{showOverlay && <Loading overlay message="Processing..." />}
```

### Pattern 2: Form Validation

```tsx
// Before - Basic validation display
{error && <div className="error">{error}</div>}

// After - Consistent error display
{error && <Alert variant="error" message={error} closable />}
```

### Pattern 3: Action Buttons

```tsx
// Before - Custom button logic
<button 
  disabled={loading}
  className={`btn ${variant}`}
  onClick={handleClick}
>
  {loading ? 'Loading...' : 'Submit'}
</button>

// After - Standardized button
<Button
  variant="primary"
  isLoading={loading}
  loadingText="Submitting..."
  onClick={handleClick}
>
  Submit
</Button>
```

## Troubleshooting Common Issues

### Issue 1: TypeScript Errors

**Problem**: New component props don't match old interfaces
**Solution**: Update prop interfaces to match new UI component APIs

```tsx
// Update interface
interface Props {
  // Before
  loading: boolean
  // After
  isLoading: boolean
}
```

### Issue 2: Styling Conflicts

**Problem**: New components have different CSS classes
**Solution**: Use className prop to maintain specific styling

```tsx
<Button 
  variant="primary"
  className="my-custom-styles"
>
  Custom Button
</Button>
```

### Issue 3: Missing Features

**Problem**: Old component had specific feature not in new component  
**Solution**: Either extend the UI component or create a feature-specific wrapper

```tsx
// Create feature-specific wrapper
function GameSearchBar(props) {
  return (
    <SearchBar
      {...props}
      placeholder="Search games..."
      autoSubmit
      rightIcon={<GameIcon />}
    />
  )
}
```

## Rollback Strategy

If you need to rollback:

1. **Keep old components**: Legacy components are still exported from main index
2. **Gradual rollback**: Change imports back to old components
3. **Test thoroughly**: Ensure functionality works as before

```tsx
// Rollback import
import LoadingState from './LoadingState' // Legacy component still available
```

## Performance Considerations

### Bundle Size Impact

- New UI components are tree-shakeable
- Only import what you use
- Pre-configured variants reduce bundle size

### Runtime Performance

- New components use modern React patterns
- Better prop handling and re-render optimization
- Consistent styling reduces CSS conflicts

## Next Steps After Migration

1. **Remove unused legacy components** once migration is complete
2. **Update tests** to work with new component APIs  
3. **Document component usage** in your specific features
4. **Consider creating feature-specific component wrappers** for common patterns

## Need Help?

- Check the component documentation in `/ui/`
- Look at existing usage patterns in the codebase
- Create feature-specific wrappers when needed
- Test thoroughly before deploying changes 