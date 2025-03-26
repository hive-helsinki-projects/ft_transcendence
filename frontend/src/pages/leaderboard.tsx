import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Player {
  name: string;
  score: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch("http://localhost:3000/leaderboard");
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : leaderboard.length === 0 ? (
        <p>No scores available yet.</p>
      ) : (
        <table className="w-1/2 border-collapse border border-gray-500">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-500 px-4 py-2">Rank</th>
              <th className="border border-gray-500 px-4 py-2">Player</th>
              <th className="border border-gray-500 px-4 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-500 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-500 px-4 py-2">{player.name}</td>
                <td className="border border-gray-500 px-4 py-2">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded">Back to Home</Link>
    </div>
  );
}
