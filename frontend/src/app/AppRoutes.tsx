import {
  DashboardPage,
  HelpPage,
  LandingPage,
  OAuth2CallbackPage,
  RegisterPage,
  SearchResultsPage,
  SettingsPage,
  TournamentPage,
} from '@/pages'
import { ProtectedRoute } from '@/shared/components/routing'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

/**
 * Centralized routing configuration
 * All application routes are defined here
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<OAuth2CallbackPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournament"
        element={
          <ProtectedRoute>
            <TournamentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchResultsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
