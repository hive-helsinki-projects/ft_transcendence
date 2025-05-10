import React from 'react';
import '../assets/styles/ProfilePage.css';

const ProfilePage: React.FC<{ user: any }> = ({ user }) => {

    return (
        <div className="profile-page">
            <h1> Profilepage of {user.username}</h1>
        </div>
    )
}

export default ProfilePage;