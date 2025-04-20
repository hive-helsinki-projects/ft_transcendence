import React from 'react'
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Pong from './game/pong'
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/DashBoard'
import Help from './pages/Help'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Sidebar from './pages/SideBar'
import Tournament from './pages/Tournament'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }
  return <>{children}</>
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
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
      } />

      {/* 404 Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
