import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import Register from '../../pages/auth/Register'
import Dashboard from '../../pages/dashboard/DashBoard'
import Tournament from '../../pages/game/Tournament'
import Help from '../../pages/help/Help'
import LandingPage from '../../pages/landing/LandingPage'
import SearchResults from '../../pages/search/SearchResults'
import Settings from '../../pages/settings/Settings'
import Pong from '../features/game/pong'
import ProfilePage from '../features/profile/ProfilePage'
import ProtectedRoute from './ProtectedRoute'

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
            <Pong />
          </ProtectedRoute>
        }
      />
      {
        <Route
          path="/tournament"
          element={
            <ProtectedRoute>
              <Tournament />
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
    </Routes>
  )
}

export default AppRoutes
