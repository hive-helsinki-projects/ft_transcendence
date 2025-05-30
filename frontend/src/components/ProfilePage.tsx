import React, { useEffect, useState } from 'react';
import '../assets/styles/ProfilePage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import FriendStatusButton from './features/profile/FriendStatusButton';
import GetUserPlayers from './features/profile/GetUserPlayers';
import MatchHistory from './features/profile/MatchHistory';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios(`https://localhost:3001/users/${id}`);
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
                    <MatchHistory userId={user.id} />
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

export default ProfilePage;