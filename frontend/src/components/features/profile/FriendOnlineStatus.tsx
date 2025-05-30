import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendOnlineStatus = ({ user }) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState('');

  useEffect(() => {
    const fetchOnlineStatus = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/users/${user.id}/online-status`);
        console.log('Online status response:', response.data);
        setIsOnline(response.data.isOnline);
        setLastSeen(response.data.lastSeen);
      } catch (error) {
        console.error('Error fetching online status:', error);
      }
    };

    fetchOnlineStatus();
  }, [user.id]);

  return (
    <div className="friend-online-status">
      {isOnline ? (
        <span className="status online">Online</span>
      ) : (
        <span className="status offline">Offline (Last seen: {lastSeen})</span>
      )}
    </div>
  );
};