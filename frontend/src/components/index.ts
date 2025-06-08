// =============================================================================
// UI COMPONENTS - Reusable, composable UI building blocks
// =============================================================================
export * from './ui'

// =============================================================================
// LAYOUT COMPONENTS - Structure and navigation
// =============================================================================
export { default as Layout } from './Layout'

// Navigation Components
export { default as SidebarItem } from './sidebar/SidebarItem'
export { default as SideBar } from './sidebar/SideBar'
export { menuItems } from './sidebar/menuItems'
export { type MenuItem } from './sidebar/SidebarItem'

// =============================================================================
// ROUTING & PROTECTION
// =============================================================================
export { default as ProtectedRoute } from './ProtectedRoute'

// =============================================================================
// FEATURE COMPONENTS - Domain-specific functionality
// =============================================================================

// Authentication Components
export { default as AuthForm } from './features/auth/AuthForm'
export { default as AuthSection } from './features/auth/AuthSection'

// Help & Support Components
export { default as ContactSection } from './features/help/ContactSection'
export { default as FAQSection } from './FAQSection'
export { default as FeedbackSection } from './features/help/FeedbackSection'
export { default as HelpSection } from './features/help/HelpSection'
export { default as RulesSection } from './RulesSection'
export { default as TroubleshootingSection } from './features/help/TroubleshootingSection'

// =============================================================================
// PAGE COMPONENTS  
// =============================================================================
export { default as HeroSection } from '../pages/landing/HeroSection'

// =============================================================================
// UTILITY COMPONENTS - Error handling, etc.
// =============================================================================
export { default as ErrorBoundary } from './ErrorBoundary'

// =============================================================================
// LEGACY COMPONENTS - To be migrated to UI components
// =============================================================================
// These components should be gradually replaced with the new UI components
export { default as LoadingContainer } from './LoadingContainer'
export { default as LoadingState } from './LoadingState'
export { default as SearchBar } from './SearchBar'
export { FormField } from './FormField'