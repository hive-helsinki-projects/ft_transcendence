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
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          {/* Left Sidebar */}
          <Sidebar />

          {/* Main Content Frame */}
          <div>
            <Routes>
              {/* Route for the Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Route for the Register Page */}
              <Route path="/register" element={<Register />} />

              {/* Route for the Dashboard Page*/}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Route for the Game Page*/}
              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <Pong />
                  </ProtectedRoute>
                }
              />

              {/* Route for the Tournament Page */}
              <Route
                path="/tournament"
                element={
                  <ProtectedRoute>
                    <Tournament />
                  </ProtectedRoute>
                }
              />

              {/* Route for the Help Page */}
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                }
              />

              {/* Route for the Settings Page */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
