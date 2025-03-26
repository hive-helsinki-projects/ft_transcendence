import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to MKVOL PONG</h1>
      <p className="text-lg mb-4">Challenge your friends in a classic Pong game!</p>
      <div className="space-x-4">
        <Link to="/game" className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded">Start Game</Link>
        <Link to="/leaderboard" className="px-6 py-3 bg-gray-500 hover:bg-gray-700 text-white rounded">Leaderboard</Link>
      </div>
    </div>
  );
}
