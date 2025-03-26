import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Game from './game/pong';
import Leaderboard from './pages/leaderboard';

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/game">Play Pong</Link>
        <Link to="/leaderboard">Leaderboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
		<Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}
