import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../auth/ProtectedRoute'
import Dashboard from '../../pages/DashBoard'
import Help from '../../pages/Help'
import LandingPage from '../../pages/landing/LandingPage'
import SearchResults from '../../pages/SearchResults'
import Register from '../../pages/Register'
import Settings from '../../pages/Settings'
import Tournament from '../../pages/Tournament'
import Pong from '../features/game/pong'
import { useAuth } from '../../hooks/auth/useAuth'
import ProfilePage from '../ProfilePage'

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
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - Only accessible to authenticated users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/game" element={
        <ProtectedRoute>
          <Pong />
        </ProtectedRoute>
      } />
      {<Route path="/tournament" element={
        <ProtectedRoute>
          <Tournament />
        </ProtectedRoute>
      } />}
      {<Route path="/profile/:id" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />}
      {<Route path="/search" element={
        <ProtectedRoute>
          <SearchResults />
        </ProtectedRoute>
      } />}
      <Route path="/help" element={
        <ProtectedRoute>
          <Help />
        </ProtectedRoute>
      } />
      {<Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />}

      {/* 404 Route - Shows when no matching route is found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes 