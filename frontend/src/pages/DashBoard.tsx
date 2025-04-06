import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../css/Dashboard.css';

interface ProfileSectionProps {
  username: string;
  avatar: string;
  onUsernameChange: (newUsername: string) => void;
  onLogout: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  username, 
  avatar, 
  onUsernameChange, 
  onLogout 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarEditing, setIsAvatarEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('avatar', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUsernameChange(tempUsername);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="profile-section">
      <div className="avatar-container">
        <img src={avatar} alt="Profile" className="avatar" />
        <button 
          type="button"
          onClick={() => setIsAvatarEditing(!isAvatarEditing)}
          className="edit-button"
          aria-label="Edit avatar"
        >
          ✏️
        </button>
        {isAvatarEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            aria-label="Upload profile picture"
          />
        )}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              placeholder="Enter new username"
              aria-label="Username"
            />
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div className="profile-info">
            <h2>Your Profile</h2>
            <div className="action-buttons">
              <button 
                type="button" 
                onClick={() => setIsEditing(true)}
                aria-label="Edit username"
              >
                ✏️
              </button>
              <button 
                type="button" 
                onClick={onLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { username: authUsername, logout } = useAuth();
  const [username, setUsername] = useState(authUsername || '');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&size=90`;
      setAvatar(randomAvatar);
      localStorage.setItem('avatar', randomAvatar);
    }
  }, [username]);

  const handleUsernameChange = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername}&size=90`;
    setAvatar(newAvatar);
    localStorage.setItem('avatar', newAvatar);
  };

  if (!authUsername) {
    return <div>Please log in to view the dashboard</div>;
  }

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <img src={avatar} alt="Profile" className="welcome-avatar" />
        <h1>Welcome, {username}!</h1>
      </div>
      <ProfileSection 
        username={username}
        avatar={avatar}
        onUsernameChange={handleUsernameChange}
        onLogout={logout}
      />
    </div>
  );
};

export default Dashboard;