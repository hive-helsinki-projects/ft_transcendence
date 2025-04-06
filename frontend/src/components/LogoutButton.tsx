import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import '../css/LogoutButton.css';

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowConfirm(false), 3000);
    } else {
      onLogout();
    }
  };

  return (
    <div className="logout-container">
      <button 
        className={`logout-button ${showConfirm ? 'confirm' : ''}`}
        onClick={handleLogoutClick}
        onMouseLeave={() => setShowConfirm(false)}
      >
        <LogOut size={18} />
        <span>{showConfirm ? 'Click again to confirm' : 'Logout'}</span>
      </button>
    </div>
  );
};

export default LogoutButton; 