import React, { useEffect, useState } from 'react'
import '@assets/styles/ProfilePage.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FriendStatusButton, GetUserPlayers, MatchHistory } from '@components/features/profile'

interface User {
  id: number;
  username: string;
  email: string;
  online_status: boolean;
  avatar_url: string;
  created_at: string;
  two_fa_enabled: boolean;
}

export const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
      const fetchUserProfile = async () => {
          try {
              let url = `https://localhost:3001/users/${id}`;
              const response = await axios.get<User>(url);
              setUser(response.data);
              const username = localStorage.getItem('username');
              if (username === response.data.username) {
                  setIsOwnProfile(true);
              }
              console.log('setUser User profile:', response.data);
          } catch (error) {
              console.error('Error fetching user profile:', error);
          }
      };
      fetchUserProfile();
  }, [id])


  if (user) {
      return (
        <div className="profile-page">
            <h1> Profilepage of {user.username}</h1>
            <div>
            {!isOwnProfile && (
                <FriendStatusButton user={user} />
            )}
            </div>
            <div>
                <GetUserPlayers userId={user.id} />
            </div>
            <div>
                <MatchHistory userId={String(user.id)} />
            </div>
        </div>
      )
  }

  return (
        <div className="profile-page">
            <h1>We did not find any user...</h1>
        </div>
  );
}
