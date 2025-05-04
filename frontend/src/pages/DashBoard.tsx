import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/auth/useAuth'
import { useAvatar } from '../hooks/useAvatar'
import { useUserPlayers } from '../hooks/useUserPlayers'
import { useMatchHistories } from '../hooks/useMatchHistories'
import { mockGameStats, mockTopPlayers, mockRecentMatches } from '../data/mockData'
import ErrorBoundary from '../components/ErrorBoundary'
import LoadingContainer from '../components/LoadingContainer'
import {
  PlayerManagement,
  GameStats,
  MatchHistory as MatchHistoryComponent,
  QuickPlay,
  TopPlayers, 
  AvatarMenu,
} from '../components/features/dashboard'
import '../assets/styles/index.css'

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth()
  const { avatar, handleAvatarChange } = useAvatar(username || '')
  const { userPlayers, createPlayer, updatePlayer, deletePlayer } = useUserPlayers()
  const { matches, loading, error } = useMatchHistories()

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  useEffect(() => {
    if (userPlayers.length > 0 && selectedPlayerId === null) {
      setSelectedPlayerId(userPlayers[0].id) // Default to first player
    }
  }, [userPlayers, selectedPlayerId])

  if (!username) {
    return <div>Please log in to view the dashboard</div>
  }

  const filteredMatches = selectedPlayerId
    ? matches.filter(match =>
        match.players.some(p => p.player_id === selectedPlayerId)
      )
    : []

  return (
    <ErrorBoundary>
      <LoadingContainer>
        <div className="dashboard">
          <div className="welcome-header">
            <h1>Welcome, {username}!</h1>
          </div>
          <PlayerManagement
            userPlayers={userPlayers}
            onCreatePlayer={createPlayer}
            onUpdatePlayer={updatePlayer}
            onDeletePlayer={deletePlayer}
          />

          <QuickPlay userPlayers={userPlayers} />

          <div className="dashboard-grid">
            <GameStats
              matches={filteredMatches}
              playerId={selectedPlayerId!}
              setPlayerId={setSelectedPlayerId}
              userPlayers={userPlayers}
            />
            <MatchHistoryComponent matches={filteredMatches} />
          </div>

          <TopPlayers players={mockTopPlayers} />

          <AvatarMenu
            avatar={avatar}
            onAvatarChange={handleAvatarChange}
            onLogout={logout}
          />
        </div>
      </LoadingContainer>
    </ErrorBoundary>
  )
}

export default Dashboard