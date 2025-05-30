import React from 'react';
import axios from 'axios';
import PlayerName from './PlayerName';

const MatchHistory = ({ userId }: { userId: string }) => {
    const [matches, setMatches] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const response = await axios.get(`https://localhost:3001/match-histories/user/${userId}`);
                setMatches(response.data);
                console.log('Match history fetched:', response.data);
            } catch (error) {
                console.error('Error fetching match history:', error);
            }
        };
        fetchMatchHistory();
    }, [userId]);

    return (
        <div className="match-history">
            <h2>Match History 1v1</h2>
            {matches.length > 0 ? (
                <ul>
                    {matches.map((match) => (
                        <li key={match.id}>
                            <p>Match Date: {match.date}</p>
                            <p>Winner: <PlayerName id={match.winner_id} />  </p>
                            <p>Player: <PlayerName id={match.players[0].player_id} /> Score: {match.players[0].score}</p>
                            <p>VS</p>
                            <p>Player: <PlayerName id={match.players[1].player_id} /> Score: {match.players[1].score} </p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No match history available.</p>
            )}
        </div>
    );
}
export default MatchHistory;