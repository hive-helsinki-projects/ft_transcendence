import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Match {
  id: number;
  opponent: string;
  result: 'Win' | 'Loss';
  date: string;
  score: string;
}

const PlayerCard = ({ playerId, userId }) => {
    const [matchHistories, setMatchHistories] = useState<Match[]>([]);

    useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const response = await axios.get(`https://localhost:3001/match-histories`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Match history response:', response.data);
                setMatchHistories(response.data || []);
            } catch (error) {
                console.error('Error fetching match history:', error);
            }
        };
        if (id) fetchMatchHistory();
    }, [id]);
    console.log(player);
    console.log(matchHistories);
    return (
        <div>
            PlayerCard
        </div>
    );
}

export default PlayerCard;