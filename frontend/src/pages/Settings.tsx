import React, { useState } from "react";

const Settings: React.FC = () => {
  const [username, setUsername] = useState("Player1");
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Light");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("User logged out");
  };

  const handleDeleteAccount = () => {
    // Add delete account logic here
    console.log("Account deleted");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Settings</h1>

      {/* Account Settings */}
      <h2>Account Settings</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      {/* Language Preferences */}
      <h2>Language Preferences</h2>
      <div>
        <label>
          Language:
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="English">English</option>
            <option value="Finnish">Finnish</option>
            <option value="Swedish">Swedish</option>
          </select>
        </label>
      </div>

      {/* Theme Settings */}
      <h2>Theme Settings</h2>
      <div>
        <label>
          Theme:
          <select
            value={theme}
            onChange={handleThemeChange}
            style={{ marginLeft: "10px", padding: "5px" }}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
            <option value="System">System Default</option>
          </select>
        </label>
      </div>

      {/* Account Management */}
      <h2>Account Management</h2>
      <div>
        <button onClick={handleLogout} style={{ marginRight: "10px", padding: "5px 10px" }}>
          Logout
        </button>
        <button onClick={handleDeleteAccount} style={{ padding: "5px 10px", color: "red" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;