import React, { useEffect, useState } from 'react';
import '../assets/styles/ProfilePage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios(`https://localhost:3001/users/${id}`);
                setUser(response.data);
                console.log('User profile:', response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserProfile();
    }, [id])

    const handleClick = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        
        try {
            const response = await axios.post(`https://localhost:3001/friend-requests/${user.id}`,
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
                    },
                }
            );
            console.log('Friend request sent:', response.data);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    }

    if (user) {
        return (
            <div className="profile-page">
                <h1> Profilepage of {user.username}</h1>
                <button onClick={handleClick}>add Friend</button>
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