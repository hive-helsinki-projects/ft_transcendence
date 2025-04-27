import {
  Check,
  Edit2,
  Globe,
  Lock,
  LogOut,
  Mail,
  Moon,
  Settings as SettingsIcon,
  Trash2,
  User,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import '../assets/styles/Settings.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/auth/useAuth'

interface UserData {
  username: string
  email: string
  password?: string
}

interface EditableFieldProps {
  field: keyof UserData
  value: string
  icon: React.ReactNode
  type?: string
  isEditing: boolean
  tempValue: string
  onEdit: (field: keyof UserData) => void
  onSave: () => void
  onCancel: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const EditableField: React.FC<EditableFieldProps> = ({
  field,
  value,
  icon,
  type = 'text',
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
}) => (
  <div className="form-group">
    <div className="field-label">
      {icon}
      <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
    </div>
    {isEditing ? (
      <input
        type={type}
        name={field}
        value={tempValue}
        onChange={onChange}
        placeholder={`Enter your ${field}`}
        autoFocus
        className="field-input"
      />
    ) : (
      <div className="field-display">
        {field === 'password' ? '********' : value}
      </div>
    )}
    <div className="field-actions">
      {!isEditing ? (
        <button className="edit-button" onClick={() => onEdit(field)}>
          <Edit2 size={16} />
          Edit
        </button>
      ) : (
        <div className="edit-actions">
          <button className="save-button" onClick={onSave}>
            <Check size={16} />
            Save
          </button>
          <button className="cancel-button" onClick={onCancel}>
            <X size={16} />
            Cancel
          </button>
        </div>
      )}
    </div>
  </div>
)

interface SettingsSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  icon,
  children,
}) => (
  <div className="settings-section">
    <h2>
      {icon}
      {title}
    </h2>
    <div className="settings-form">{children}</div>
  </div>
)

const Settings: React.FC = () => {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()

  const [userData, setUserData] = useState<UserData>({
    username: username || '',
    email: '',
    password: '',
  })
  const [tempData, setTempData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
  })
  const [editingField, setEditingField] = useState<keyof UserData | null>(null)
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState('Dark')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleEditClick = (field: keyof UserData) => {
    setEditingField(field)
    setTempData((prev) => ({
      ...prev,
      [field]: field === 'password' ? '' : userData[field],
    }))
    setError(null)
    setSuccess(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveClick = async () => {
    if (!editingField) return

    try {
      const fieldToUpdate = editingField
      const newValue = tempData[fieldToUpdate] || ''

      if (!newValue.trim()) {
        setError(`${fieldToUpdate} cannot be empty`)
        return
      }

      const response = await fetch(`/api/users/${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [fieldToUpdate]: newValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user data')
      }

      setUserData((prev) => ({
        ...prev,
        [fieldToUpdate]: fieldToUpdate === 'password' ? '********' : newValue,
      }))

      setEditingField(null)
      setSuccess(`${fieldToUpdate} updated successfully`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleCancelClick = () => {
    setEditingField(null)
    setError(null)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      setError('Failed to logout')
    }
  }

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        const response = await fetch(`/api/users/${token}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete account')
        }

        await logout()
        navigate('/login')
      } catch {
        setError('Failed to delete account')
      }
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <SettingsIcon size={24} />
          <h1>Settings</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <SettingsSection title="Account Settings" icon={<User size={18} />}>
          <EditableField
            field="username"
            value={userData.username}
            icon={<User size={16} />}
            isEditing={editingField === 'username'}
            tempValue={tempData.username}
            onEdit={handleEditClick}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
            onChange={handleInputChange}
          />
          <EditableField
            field="email"
            value={userData.email}
            icon={<Mail size={16} />}
            isEditing={editingField === 'email'}
            tempValue={tempData.email}
            onEdit={handleEditClick}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
            onChange={handleInputChange}
          />
          <EditableField
            field="password"
            value={userData.password || ''}
            icon={<Lock size={16} />}
            type="password"
            isEditing={editingField === 'password'}
            tempValue={tempData.password || ''}
            onEdit={handleEditClick}
            onSave={handleSaveClick}
            onCancel={handleCancelClick}
            onChange={handleInputChange}
          />
        </SettingsSection>

        <SettingsSection title="Language Preferences" icon={<Globe size={18} />}>
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
        </SettingsSection>

        <SettingsSection title="Theme Settings" icon={<Moon size={18} />}>
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
        </SettingsSection>

        <SettingsSection title="Account Management" icon={<User size={18} />}>
          <button className="settings-button" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
          <button className="settings-button delete" onClick={handleDeleteAccount}>
            <Trash2 size={16} />
            Delete Account
          </button>
        </SettingsSection>
      </div>
    </div>
  )
}

export default Settings
