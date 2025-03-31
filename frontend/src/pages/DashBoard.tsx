import React, { useState } from "react";

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState("Player1"); // Default username
  const [avatar, setAvatar] = useState("https://placehold.co/90x90"); // Default avatar URL
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [newUsername, setNewUsername] = useState(username); // Temporary username for editing

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUsername(newUsername);
    setIsEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div>
        <img
          src={avatar}
          alt="Avatar"
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <div>
          <label htmlFor="avatar-upload" style={{ cursor: "pointer", color: "blue" }}>
            Change Avatar
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={{ padding: "5px", fontSize: "16px" }}
            />
            <button onClick={handleSave} style={{ marginLeft: "10px", padding: "5px 10px" }}>
              Save
            </button>
          </div>
        ) : (
          <div>
            <h2>Welcome, {username}!</h2>
            <button onClick={handleEdit} style={{ padding: "5px 10px" }}>
              Edit Name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;