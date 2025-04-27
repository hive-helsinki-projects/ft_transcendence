import React from 'react'
import { Player } from './TournamentState'

interface ChampionCardProps {
  champion: Player
}

export const ChampionCard: React.FC<ChampionCardProps> = ({ champion }) => (
  <div className="match-card champion" role="article" aria-label="Tournament champion">
    <h3>CHAMPION</h3>
    <div className="champion-display">
      <img
        src={champion.avatar}
        alt={`${champion.name}'s avatar`}
        className="champion-avatar"
      />
      <span className="champion-name">{champion.name}</span>
    </div>
  </div>
) 