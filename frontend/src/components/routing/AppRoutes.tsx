import React from 'react'
import { Routes, Route } from 'react-router-dom'
//import { ProtectedRoute } from '../'
// import Dashboard from '../pages/DashBoard'
// import Help from '../pages/Help'
import LandingPage from '../../pages/landing/LandingPage'
import Register from '../../pages/Register'
// import Settings from '../pages/Settings'
// import Tournament from '../pages/Tournament'
// import Pong from '../features/game/pong'

/**
 * AppRoutes Component
 * This component defines all the routes in the application
 * It includes both public and protected routes
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<LandingPage />} />
      {<Route path="/register" element={<Register />} />}

      {/* Protected Routes - Only accessible to authenticated users */}
      {/* <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/game" element={
        <ProtectedRoute>
          <Pong />
        </ProtectedRoute>
      } />
      <Route path="/tournament" element={
        <ProtectedRoute>
          <Tournament />
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute>
          <Help />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } /> */}

      {/* 404 Route - Shows when no matching route is found */}
      {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
    </Routes>
  )
}

export default AppRoutes 