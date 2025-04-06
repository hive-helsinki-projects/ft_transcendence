import React, { useState, useContext } from "react";
import { Settings as SettingsIcon, User, Globe, Moon, LogOut, Trash2, Mail, Lock, Edit2, Check, X } from "lucide-react";
import "../css/Settings.css";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserData {
  username: string;
  email: string;
  password?: string;
}

const Settings: React.FC = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  const { token, username, logout } = authContext;
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({
    username: username || "",
    email: "",
    password: ""
  });
  const [tempData, setTempData] = useState<UserData>({
    username: "",
    email: "",
    password: ""
  });
  const [editingField, setEditingField] = useState<keyof UserData | null>(null);
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Dark");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEditClick = (field: keyof UserData) => {
    setEditingField(field);
    setTempData(prev => ({
      ...prev,
      [field]: field === "password" ? "" : userData[field]
    }));
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClick = async () => {
    if (!editingField) return;

    try {
      const fieldToUpdate = editingField;
      const newValue = tempData[fieldToUpdate] || "";

      if (!newValue.trim()) {
        setError(`${fieldToUpdate} cannot be empty`);
        return;
      }

      // Call API to update user data
      const response = await fetch(`/api/users/${token}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [fieldToUpdate]: newValue
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      // Update local state
      setUserData(prev => ({
        ...prev,
        [fieldToUpdate]: fieldToUpdate === "password" ? "********" : newValue
      }));

      // Update auth context if username or email changed
      if (fieldToUpdate === "username" || fieldToUpdate === "email") {
        // Assuming updateUser function is called elsewhere in the code
      }

      setEditingField(null);
      setSuccess(`${fieldToUpdate} updated successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleCancelClick = () => {
    setEditingField(null);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to logout");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/users/${token}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        await logout();
        navigate("/login");
      } catch {
        setError("Failed to delete account");
      }
    }
  };

  const renderEditableField = (
    field: keyof UserData,
    value: string,
    icon: React.ReactNode,
    type: string = "text"
  ) => {
    const isEditing = editingField === field;

    return (
      <div className="form-group">
        <div className="field-label">
          {icon}
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        </div>
        {isEditing ? (
          <input
            type={type}
            name={field}
            value={tempData[field]}
            onChange={handleInputChange}
            placeholder={`Enter your ${field}`}
            autoFocus
            className="field-input"
          />
        ) : (
          <div className="field-display">
            {field === "password" ? "********" : value}
          </div>
        )}
        <div className="field-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={() => handleEditClick(field)}>
              <Edit2 size={16} />
              Edit
            </button>
          ) : (
            <div className="edit-actions">
              <button className="save-button" onClick={handleSaveClick}>
                <Check size={16} />
                Save
              </button>
              <button className="cancel-button" onClick={handleCancelClick}>
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <SettingsIcon size={24} />
          <h1>Settings</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Account Settings */}
        <div className="settings-section">
          <h2>
            <User size={18} />
            Account Settings
          </h2>
          <div className="settings-form">
            {renderEditableField("username", userData.username, <User size={16} />)}
            {renderEditableField("email", userData.email, <Mail size={16} />)}
            {renderEditableField("password", userData.password || "", <Lock size={16} />, "password")}
          </div>
        </div>

        {/* Language Preferences */}
        <div className="settings-section">
          <h2>
            <Globe size={18} />
            Language Preferences
          </h2>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="form-group input"
              >
                <option value="English">English</option>
                <option value="Finnish">Finnish</option>
                <option value="Swedish">Swedish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="settings-section">
          <h2>
            <Moon size={18} />
            Theme Settings
          </h2>
          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="form-group input"
              >
                <option value="Dark">Dark</option>
                <option value="Light">Light</option>
                <option value="System">System Default</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Management */}
        <div className="settings-section">
          <h2>Account Management</h2>
          <div className="settings-form">
            <button className="settings-button" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
            <button className="settings-button delete" onClick={handleDeleteAccount}>
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;