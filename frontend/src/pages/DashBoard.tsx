import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth/useAuth'
import { useAvatar } from '../hooks/useAvatar'
import { useUserPlayers } from '../hooks/useUserPlayers'
import { useMatchHistories } from '../hooks/useMatchHistories'
import axios from 'axios'
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
import SearchBar from '../components/SearchBar'
import { useNavigate } from 'react-router-dom'
import useTranslate from '../hooks/useTranslate'

const Dashboard: React.FC = () => {
  const { id: userId, username, logout } = useAuth()
  const parsedId = userId ? parseInt(userId, 10) : null
  const { avatar, handleAvatarChange } = useAvatar(parsedId)
  const { userPlayers, createPlayer, deletePlayer } = useUserPlayers()
  const { matches } = useMatchHistories()
  const t = useTranslate()

  const navigate = useNavigate();

  useEffect(() => { 
    const token = localStorage.getItem('token');
    const deleteUnfinishedMatches = async () => {
      try {
        await axios.delete('https://localhost:3001/match-histories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
      } catch (error) {
        console.error('Error deleting unfinished matches:', error)
      }
    }
    deleteUnfinishedMatches();
  },[])
    

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      console.log('Searching for:', query)
    }
  }

  
  if (!username) {
    return <div>Please log in to view the dashboard</div>
  }
  return (
    <ErrorBoundary>
      <LoadingContainer>
        <div className="dashboard">
          <div className="welcome-header">
            <h1>{t('dashboard.welcome')}, {username}!</h1>
            <SearchBar onSearch={handleSearch} />
          </div>
          <PlayerManagement
            userPlayers={userPlayers}
            onCreatePlayer={createPlayer}
            onDeletePlayer={deletePlayer}
          />

          <QuickPlay userPlayers={userPlayers} />

          <div className="dashboard-grid">
            <GameStats
              userPlayers={userPlayers}
            />
            <MatchHistoryComponent matches={matches} />
          </div>

          <TopPlayers players={userPlayers} />

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