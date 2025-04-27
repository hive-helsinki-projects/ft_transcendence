import React, { useEffect, useState } from 'react'
import { LogOut, Pencil, Settings } from 'lucide-react'
import { useAuth } from '../hooks/auth/useAuth'
import LoadingContainer from '../components/LoadingContainer'
import PlayerManagement from '../components/features/dashboard/PlayerManagement'
import GameStats from '../components/features/dashboard/GameStats'
import MatchHistoryComponent from '../components/features/dashboard/MatchHistory'
import QuickPlay from '../components/features/dashboard/QuickPlay'
import '../assets/styles/index.css'

interface UserPlayer {
  id: string
  name: string
  avatar: string
  isActive: boolean
  points: number
}

interface TopPlayer {
  id: string
  name: string
  points: number
  avatar: string
}

interface MatchHistory {
  id: string
  player: {
    name: string
    avatar: string
  }
  opponent: {
    name: string
    avatar: string
  }
  result: 'win' | 'loss'
  score: string
  date: string
  mode: '1v1' | 'tournament'
}

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth()
  const [avatar, setAvatar] = useState('')
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([])

  const gameStats = {
    wins: 15,
    losses: 8,
    winRate: 65,
    totalGames: 23,
  }

  const topPlayers: TopPlayer[] = [
    {
      id: '1',
      name: 'Player1',
      points: 12565,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
    },
    {
      id: '2',
      name: 'Player2',
      points: 10558,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
    },
    {
      id: '3',
      name: 'Player3',
      points: 9856,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
    },
    {
      id: '4',
      name: 'Player4',
      points: 7415,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
    },
  ]

  const recentMatches: MatchHistory[] = [
    {
      id: '1',
      player: {
        name: 'Player1',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1',
      },
      opponent: {
        name: 'Player4',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4',
      },
      result: 'win',
      score: '11-9',
      date: '2h ago',
      mode: '1v1',
    },
    {
      id: '2',
      player: {
        name: 'Player2',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2',
      },
      opponent: {
        name: 'Player5',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player5',
      },
      result: 'loss',
      score: '9-11',
      date: '3h ago',
      mode: 'tournament',
    },
    {
      id: '3',
      player: {
        name: 'Player3',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3',
      },
      opponent: {
        name: 'Player6',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player6',
      },
      result: 'win',
      score: '11-7',
      date: '5h ago',
      mode: '1v1',
    },
  ]

  const handleCreatePlayer = (playerName: string) => {
    const newPlayer: UserPlayer = {
      id: Date.now().toString(),
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}-${Date.now()}`,
      isActive: true,
      points: 0,
    }

    setUserPlayers((prev) => [...prev, newPlayer])
  }

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar')
    if (savedAvatar) {
      setAvatar(savedAvatar)
    } else {
      const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&size=100`
      setAvatar(randomAvatar)
      localStorage.setItem('avatar', randomAvatar)
    }
  }, [username])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newAvatar = reader.result as string
        setAvatar(newAvatar)
        localStorage.setItem('avatar', newAvatar)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!username) {
    return <div>Please log in to view the dashboard</div>
  }

  return (
    <LoadingContainer>
      <div className="dashboard">
        <div className="welcome-header">
          <h1>Welcome, {username}!</h1>
        </div>

        <PlayerManagement
          userPlayers={userPlayers}
          onCreatePlayer={handleCreatePlayer}
        />

        <QuickPlay userPlayers={userPlayers} />

        <div className="dashboard-grid">
          <GameStats stats={gameStats} />
          <MatchHistoryComponent matches={recentMatches} />
        </div>

        <div className="top-players-section">
          <h2>TOP PLAYERS</h2>
          <div className="players-grid">
            {topPlayers.map((player) => (
              <div key={player.id} className="player-card">
                <img
                  src={player.avatar}
                  alt={`${player.name}'s avatar`}
                  className="player-avatar"
                />
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-points">{player.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="avatar-container">
          <img src={avatar} alt="User avatar" className="welcome-avatar" />
          <div className="online-status" />
          <div className="avatar-menu">
            <div className="settings-avatar-container">
              <img src={avatar} alt="User avatar" className="settings-avatar" />
              <button
                type="button"
                className="settings-edit-button"
                onClick={() =>
                  document.getElementById('avatar-upload')?.click()
                }
                aria-label="Edit avatar"
              >
                <Pencil size={14} />
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
                id="avatar-upload"
                aria-label="Upload profile picture"
                style={{ display: 'none' }}
              />
            </div>
            <button className="avatar-menu-button">
              <Settings size={16} />
              <span>Profile Settings</span>
            </button>
            <button className="avatar-menu-button logout" onClick={logout}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </LoadingContainer>
  )
}

export default Dashboard
