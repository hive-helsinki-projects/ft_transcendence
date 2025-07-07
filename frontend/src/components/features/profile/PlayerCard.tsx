import React from 'react'

interface Player {
    id: number;
    display_name: string;
    wins: number;
    losses: number;
    avatar_url: string;
    created_at: string;
  }

  interface PlayerCardProps {
    player: Player;
  }

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {

    return (
        <div>
            <h1>PlayerCard</h1>
            <p>Avatar_url: {player.avatar_url} </p>
            <p>Display name: {player.display_name} </p>
            <p>Wins: {player.wins} </p>
            <p>Losses: {player.losses}</p>
        </div>
    );
}
