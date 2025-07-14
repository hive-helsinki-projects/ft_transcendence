import {
  useMatchHistories,
  useTranslate,
  useUserPlayers,
} from '@hooks/index'
import axios from 'axios'
import React, { useEffect } from 'react'
import {
  GameStats,
  MatchHistory as MatchHistoryComponent,
  PlayerManagement,
  QuickPlay,
  TopPlayers,
} from '@components/features/dashboard'
import { SearchBar} from '@components/index'
import { API_URL } from '@utils/constants'
import { useNavigate } from 'react-router-dom'

export const Dashboard: React.FC = () => {
  const { userPlayers, createPlayer, deletePlayer } = useUserPlayers()
  const { matches } = useMatchHistories()
  const t = useTranslate()

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const deleteUnfinishedMatches = async () => {
      try {
        await axios.delete(`${API_URL}/match-histories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Error deleting unfinished matches:', error)
      }
    }
    deleteUnfinishedMatches()
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?query=${query}`)
      console.log('Searching for:', query)
    }
  }

  return (
    <div className="dashboard">
      <div className="welcome-header">
        <h1>
          {t('dashboard.welcome')}
        </h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      <PlayerManagement
        userPlayers={userPlayers}
        onCreatePlayer={createPlayer}
        onDeletePlayer={deletePlayer}
      />

      <QuickPlay userPlayers={userPlayers} />

      <div className="dashboard-grid">
        <GameStats userPlayers={userPlayers} />
        <MatchHistoryComponent matches={matches} />
      </div>

      <TopPlayers players={userPlayers} />
    </div>
  )
}
