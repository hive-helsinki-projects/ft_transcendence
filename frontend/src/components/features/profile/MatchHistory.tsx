import React from 'react';
import axios from 'axios';

const MatchHistory = ({ userId }: { userId: string }) => {
    const [matches, setMatches] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                const response = await axios.get(`https://localhost:3001/match-histories/user/${userId}`);
                console.log('Fetched match history:', response.data);
                setMatches(response.data);
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
                            <p>match_date: {match.date} </p>
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