import axios from 'axios'
import React from 'react'
import { PlayerName } from './PlayerName'
import { useTranslate } from '@hooks/index'


interface MatchPlayer {
    player_id: number;
    score: number;
}
  
interface Match {
    id: number;
    type: string;
    tournament_id: number;
    date: string;
    round: number;
    status: string;
    winner_id: number;
    players: MatchPlayer[];
}


export const MatchHistory = ({ userId }: { userId: string }) => {
    const [matches, setMatches] = React.useState<Match[]>([]);

    React.useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const response = await axios.get<Match[]>(`https://localhost:3001/match-histories/user/${userId}`);
                setMatches(response.data);
                console.log('Match history fetched:', response.data);
            } catch (error) {
                console.error('Error fetching match history:', error);
            }
        };
        fetchMatchHistory();
    }, [userId]);

    const t = useTranslate()
    return (
        <div className="match-history">
            <h2>{t('Match History 1v1')}</h2>
            {matches.length > 0 ? (
                <ul>
                    {matches.map((match) => (
                        <li key={match.id}>
                            <p>{t('Match Date')}: {match.date}</p>
                            <p>{t('Winner')}: <PlayerName id={String(match.winner_id)} />  </p>
                            <p>{t('Player')}: <PlayerName id={String(match.players[0].player_id)} /> {t('Score')}: {match.players[0].score}</p>
                            <p>VS</p>
                            <p>{t('Player')}: <PlayerName id={String(match.players[1].player_id)} /> {t('Score')}: {match.players[1].score} </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t('No match history available.')}</p>
            )}
        </div>
    );
}
