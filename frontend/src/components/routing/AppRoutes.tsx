import ProtectedRoute from './ProtectedRoute'
import { Game } from '@components/features/game/pong'
import { useAuth } from '@hooks/auth/useAuth'
import {
  Dashboard,
  Help,
  LandingPage,
  OAuth2Callback,
  ProfilePage,
  Register,
  SearchResults,
  Settings,
  TournamentPage,
} from '@pages/index'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

/**
 * AppRoutes Component
 * This component defines all the routes in the application
 * It includes both public and protected routes
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Only accessible to authenticated users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <Game />
          </ProtectedRoute>
        }
      />
      {
        <Route
          path="/tournament"
          element={
            <ProtectedRoute>
              <TournamentPage />
            </ProtectedRoute>
          }
        />
      }
      {
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      }
      {
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          }
        />
      }
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        }
      />
      {
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      }

      {/* 404 Route - Shows when no matching route is found */}
      <Route path="*" element={<div>404 Not Found</div>} />

      <Route path="/oauth2callback" element={<OAuth2Callback />} />
    </Routes>
  )
}

export default AppRoutes
