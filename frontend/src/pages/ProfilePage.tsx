import React, { useEffect, useState } from 'react'
import '@assets/styles/ProfilePage.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FriendStatusButton, GetUserPlayers, MatchHistory, FriendList } from '@components/features/profile'
import { LoadingContainer } from '@components/index'
import { ErrorBoundary } from '@components/ErrorBoundary'

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
              let url = '';
              if (id == null) {
                const id2 = localStorage.getItem('id');
                  url = `https://localhost:3001/users/${id2}`;
              } else {
                  url = `https://localhost:3001/users/${id}`;
              }
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
        <ErrorBoundary>
            <LoadingContainer>
                <div className="profile-page">
                    <div className="profile-header">
                        <h1>{isOwnProfile ? 'My Profile' : user.username}</h1>
                        
                        <div className="profile-actions">
                            {isOwnProfile ? (
                                <button 
                                    className="edit-profile-btn"
                                    onClick={() => window.location.href = '/settings'}
                                >
                                    Settings
                                </button>
                            ) : (
                                <FriendStatusButton user={user} />
                            )}
                        </div>
                    </div>
                    
                    <div className="profile-content">
                        {isOwnProfile && <FriendList />}
                        
                        <div className="players-section">
                            <GetUserPlayers userId={user.id} />
                        </div>
                        
                        <div className="match-history-section">
                            <MatchHistory userId={String(user.id)} />
                        </div>
                    </div>
            </div>
            </LoadingContainer>
        </ErrorBoundary>
          
      )
  }
}

