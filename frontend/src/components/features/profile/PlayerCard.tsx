import React from 'react'
import { useTranslate } from '@hooks/index'

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
  const t = useTranslate()
    return (
        // <div>
        //     <h1>PlayerCard</h1>
        //     <p>Avatar_url: {player.avatar_url} </p>
        //     <p>Display name: {player.display_name} </p>
        //     <p>Wins: {player.wins} </p>
        //     <p>Losses: {player.losses}</p>
        // </div>
        <div>
          <h1>{t('PlayerCard')}</h1>
          <p>{t('Avatar')}: {player.avatar_url}</p>
          <p>{t('Display Name')}: {player.display_name}</p>
          <p>{t('Wins')}: {player.wins}</p>
          <p>{t('Losses')}: {player.losses}</p>
        </div>

    );
}
