import React from 'react';
import axios from 'axios';

const MatchHistory = ({ userId }: { userId: string }) => {
    const [matches, setMatches] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const response = await axios.get(`https://localhost:3001/match-history/${userId}`);
                setMatches(response.data);
            } catch (error) {
                console.error('Error fetching match history:', error);
            }
        };
        fetchMatchHistory();
    }, [userId]);

    return (
        <div className="match-history">
            <h2>Match History</h2>
            {matches.length > 0 ? (
                <ul>
                    {matches.map((match) => (
                        <li key={match.id}>
                            {match.date} - {match.result} - {match.opponent}
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