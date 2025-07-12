import React from 'react'
import { MatchHistory as DashboardMatchHistory } from '@components/features/dashboard'
import { useUserMatchHistory } from '@hooks/index'

interface UserMatchHistoryProps {
  userId: string | number
}

export const UserMatchHistory: React.FC<UserMatchHistoryProps> = ({ userId }) => {
  const { matches, loading, error } = useUserMatchHistory(userId)

  if (loading) {
    return (
      <div>
        <p>Loading match history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <p>Error loading match history</p>
      </div>
    )
  }

  return <DashboardMatchHistory matches={matches} />
} 