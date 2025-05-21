import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendStatusButton = ({ user }) => {
  const [friendStatus, setFriendStatus] = useState('none');

  useEffect(() => {
    const fetchFriendStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await axios.get(`https://localhost:3001/friends/${user.id}/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Friend status:', response.data);
        setFriendStatus(response.data); // Expected: 'friends', 'pending', or 'none'
      } catch (error) {
        console.error('Error fetching friend status:', error);
      }
    };

    fetchFriendStatus();
  }, [user.id]);

  const handleAddFriend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/friend-requests/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Friend request sent:', response.data);
      setFriendStatus('pending');
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleRemoveFriend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:3001/friends/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Friend removed');
      setFriendStatus('none');
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div>
      {friendStatus === 'accepted' && (
        <button onClick={handleRemoveFriend}>Remove Friend</button>
      )}
      {friendStatus === 'pending' && (
        <button disabled>Request Pending</button>
      )}
      {friendStatus === 'none' && (
        <button onClick={handleAddFriend}>Add Friend</button>
      )}
    </div>
  );
};

export default FriendStatusButton;
