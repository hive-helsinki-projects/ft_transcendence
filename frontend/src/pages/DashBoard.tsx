import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingContainer from '../components/LoadingContainer';
import { LogOut, Settings, Pencil, UserPlus } from 'lucide-react';
import '../css/Dashboard.css';

interface GameStats {
  wins: number;
  losses: number;
  winRate: number;
  totalGames: number;
}

interface TopPlayer {
  id: string;
  name: string;
  points: number;
  avatar: string;
}

interface UserPlayer {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
  points: number;
}

const CreatePlayerModal: React.FC<{
  onClose: () => void;
  onCreatePlayer: (playerName: string) => void;
}> = ({ onClose, onCreatePlayer }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onCreatePlayer(playerName.trim());
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Player</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name"
              maxLength={20}
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
    <h2>Game Modes</h2>
    <div className="play-options">
      <button className="play-button one-vs-one">
        <span className="button-icon">⚔️</span>
        1v1 Match
      </button>
      <button className="play-button matchmaking">
        <span className="button-icon">🏆</span>
        Tournament Mode
      </button>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { username, logout } = useAuth();
  const [avatar, setAvatar] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userPlayers, setUserPlayers] = useState<UserPlayer[]>([]);

  const gameStats: GameStats = {
    wins: 15,
    losses: 8,
    winRate: 65,
    totalGames: 23
  };

  const topPlayers: TopPlayer[] = [
    {
      id: '1',
      name: 'Player1',
      points: 12565,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player1'
    },
    {
      id: '2',
      name: 'Player2',
      points: 10558,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player2'
    },
    {
      id: '3',
      name: 'Player3',
      points: 9856,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player3'
    },
    {
      id: '4',
      name: 'Player4',
      points: 7415,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=player4'
    }
  ];

  const handleCreatePlayer = (playerName: string) => {
    const newPlayer: UserPlayer = {
      id: Date.now().toString(),
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}-${Date.now()}`,
      isActive: true,
      points: 0,
    };
    
    setUserPlayers(prev => [...prev, newPlayer]);
  };

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
        <div className="welcome-header">
          <h1>Welcome, {username}!</h1>
        </div>

        <div className="players-management">
          <div className="players-header">
            <h2>Your Players</h2>
            <button 
              className="create-player-button"
              onClick={() => setShowCreateModal(true)}
            >
              <UserPlus size={16} />
              <span>Create Player</span>
            </button>
          </div>
          <div className="players-list">
            {userPlayers.map(player => (
              <div 
                key={player.id} 
                className={`player-item ${player.isActive ? 'active' : ''}`}
              >
                <img src={player.avatar} alt={`${player.name}'s avatar`} className="player-item-avatar" />
                <div className="player-item-info">
                  <span className="player-item-name">{player.name}</span>
                  <span className="player-item-points">{player.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-play-section">
          <h2>Game Modes</h2>
          <div className="play-options">
            <button className="play-button one-vs-one">
              <span className="button-icon">⚔️</span>
              1v1 Match
            </button>
            <button className="play-button matchmaking">
              <span className="button-icon">🏆</span>
              Tournament Mode
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <GameStatsSection stats={gameStats} />
        </div>

        <div className="top-players-section">
          <h2>TOP PLAYERS</h2>
          <div className="players-grid">
            {topPlayers.map(player => (
              <div key={player.id} className="player-card">
                <img src={player.avatar} alt={`${player.name}'s avatar`} className="player-avatar" />
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-points">{player.points} points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="avatar-container">
          <img src={avatar} alt="User avatar" className="welcome-avatar" />
          <div className="online-status" />
          <div className="avatar-menu">
            <div className="settings-avatar-container">
              <img src={avatar} alt="User avatar" className="settings-avatar" />
              <button 
                type="button"
                className="settings-edit-button"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                aria-label="Edit avatar"
              >
                <Pencil size={14} />
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

        {showCreateModal && (
          <CreatePlayerModal
            onClose={() => setShowCreateModal(false)}
            onCreatePlayer={handleCreatePlayer}
          />
        )}
      </div>
    </LoadingContainer>
  );
};

export default Dashboard;