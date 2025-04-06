import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingContainer from '../components/LoadingContainer';
import { LogOut, Settings, Pencil } from 'lucide-react';
import '../css/Dashboard.css';

interface GameStats {
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
}

interface RecentMatch {
  id: string;
  opponent: string;
  result: 'win' | 'loss';
  score: string;
  date: string;
}

const GameStatsSection: React.FC<{ stats: GameStats }> = ({ stats }) => (
  <div className="stats-section">
    <h2>Your Stats</h2>
    <div className="stats-grid">
      <div className="stat-item">
        <span className="stat-value">{stats.wins}</span>
        <span className="stat-label">Wins</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.losses}</span>
        <span className="stat-label">Losses</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.winRate}%</span>
        <span className="stat-label">Win Rate</span>
      </div>
      <div className="stat-item">
        <span className="stat-value">{stats.totalGames}</span>
        <span className="stat-label">Total Games</span>
      </div>
    </div>
  </div>
);

const QuickPlaySection: React.FC = () => (
  <div className="quick-play-section">
    <h2>Quick Play</h2>
    <div className="play-options">
      <button className="play-button practice">
        <span className="button-icon">🎮</span>
        Practice Mode
      </button>
      <button className="play-button matchmaking">
        <span className="button-icon">🏆</span>
        Find Match
      </button>
      <button className="play-button custom">
        <span className="button-icon">👥</span>
        Create Custom Game
      </button>
    </div>
  </div>
);

const RecentMatchesSection: React.FC<{ matches: RecentMatch[] }> = ({ matches }) => (
  <div className="recent-matches-section">
    <h2>Recent Matches</h2>
    <div className="matches-list">
      {matches.map(match => (
        <div key={match.id} className={`match-item ${match.result}`}>
          <div className="match-info">
            <span className="opponent">vs {match.opponent}</span>
            <span className="score">{match.score}</span>
          </div>
          <div className="match-date">{match.date}</div>
        </div>
      ))}
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth();
  const [avatar, setAvatar] = useState('');

  const gameStats: GameStats = {
    wins: 15,
    losses: 8,
    winRate: 65,
    totalGames: 23
  };

  const recentMatches: RecentMatch[] = [
    {
      id: '1',
      opponent: 'Player123',
      result: 'win',
      score: '11-9',
      date: '2h ago'
    },
    {
      id: '2',
      opponent: 'PongMaster',
      result: 'loss',
      score: '8-11',
      date: '5h ago'
    },
    {
      id: '3',
      opponent: 'SpinKing',
      result: 'win',
      score: '11-7',
      date: '1d ago'
    }
  ];

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&size=100`;
      setAvatar(randomAvatar);
      localStorage.setItem('avatar', randomAvatar);
    }
  }, [username]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        setAvatar(newAvatar);
        localStorage.setItem('avatar', newAvatar);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!username) {
    return <div>Please log in to view the dashboard</div>;
  }

  return (
    <LoadingContainer>
      <div className="dashboard">
        <div className="welcome-section">
          <h2>Your Profile</h2>
          <div className="header-avatar-container">
            <img src={avatar} alt="User avatar" className="header-avatar" />
            <button 
              type="button"
              className="header-edit-button"
              onClick={() => document.getElementById('avatar-upload')?.click()}
              aria-label="Edit avatar"
            >
              <Pencil size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
              id="avatar-upload"
              aria-label="Upload profile picture"
              style={{ display: 'none' }}
            />
          </div>
          <h1>Welcome, {username}!</h1>
        </div>

        <div className="dashboard-grid">
          <GameStatsSection stats={gameStats} />
          <QuickPlaySection />
          <RecentMatchesSection matches={recentMatches} />
        </div>

        <div className="avatar-container">
          <img src={avatar} alt="User avatar" className="welcome-avatar" />
          <div className="online-status" />
          <div className="avatar-menu">
            <button className="avatar-menu-button">
              <Settings size={16} />
              <span>Profile Settings</span>
            </button>
            <button 
              className="avatar-menu-button logout"
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </LoadingContainer>
  );
};

export default Dashboard;