import React from 'react'
import { TopPlayer } from '../../../types/dashboard'

interface TopPlayersProps {
  players: TopPlayer[]
}

const TopPlayers: React.FC<TopPlayersProps> = ({ players }) => {
  return (
    <div className="top-players-section">
      <h2>TOP PLAYERS</h2>
      <div className="players-grid">
        {players.map((player) => (
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
  )
}

export default TopPlayers 