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
import { useAuth, useTranslate } from '@hooks/index'
import i18n from '@i18n/config'
import { api } from '@services/api'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface UserData {
  username: string
  email: string
  password?: string
  avatar_url?: string
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
}) => {
  const t = useTranslate()

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
            {t('Edit')}
          </button>
        ) : (
          <div className="edit-actions">
            <button className="save-button" onClick={onSave}>
              <Check size={16} />
              {t('Save')}
            </button>
            <button className="cancel-button" onClick={onCancel}>
              <X size={16} />
              {t('Cancel')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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

export const Settings: React.FC = () => {
  const { id: userId, username, logout } = useAuth()
  const navigate = useNavigate()
  const t = useTranslate()

  const [userData, setUserData] = useState<UserData>({
    username: username || '',
    email: '',
    password: '',
    avatar_url: '',
  })
  const [tempData, setTempData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
  })
  const [editingField, setEditingField] = useState<keyof UserData | null>(null)
  const [language, setLanguage] = useState(i18n.language)
  const [theme, setTheme] = useState('Dark')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null)

  const [twoFaEnabled, setTwoFaEnabled] = useState<boolean>(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [twoFaToken, setTwoFaToken] = useState<string>('')
  const [twoFaMessage, setTwoFaMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await api.get(`/users/${userId}`)
        setUserData({
          username: user.username,
          email: user.email,
          password: '',
          avatar_url: user.avatar_url || '',
        })
      } catch (err) {
        console.error('Failed to load profile', err)
      }
    }
    if (userId) loadProfile()
  }, [userId])

  useEffect(() => {
    const fetch2faStatus = async () => {
      try {
        const res = await api.get('/api/2fa/status')
        setTwoFaEnabled(res.twoFaEnabled === true)
      } catch {
        setTwoFaEnabled(false)
      }
    }

    fetch2faStatus()
  }, [])

  const enable2fa = async () => {
    try {
      const res = await api.get('/api/2fa/setup')
      setQrDataUrl(res.qrDataUrl)
      setTwoFaMessage(null)
    } catch {
      setTwoFaMessage('Failed to generate QR code')
    }
  }

  const verify2FA = async () => {
    try {
      await api.post('/api/2fa/verify', { token: twoFaToken })
      setTwoFaEnabled(true)
      setQrDataUrl(null)
      setTwoFaToken('')
      setTwoFaMessage('2FA enabled!')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTwoFaMessage(err.message || 'Invalid 2FA code');
      } else {
        setTwoFaMessage('Invalid 2FA code');
      }
    }
  }

  const disable2FA = async () => {
    try {
      await api.delete('/api/2fa')
      setTwoFaEnabled(false)
      setTwoFaMessage('2FA disabled.')
    } catch {
      setTwoFaMessage('Failed to disable 2FA')
    }
  }

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

      await api.put(`/users/${userId}`, {
        [fieldToUpdate]: newValue,
      })

      setUserData((prev) => ({
        ...prev,
        [fieldToUpdate]: fieldToUpdate === 'password' ? '********' : newValue,
      }))

      setEditingField(null)
      setSuccess(`${fieldToUpdate} updated successfully`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : t('errors.general'))
    }
  }

  const handleCancelClick = () => {
    setEditingField(null)
    setError(null)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null)
    setAvatarSuccess(null)
    if (!userId) return

    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.uploadAvatar(
        `/users/${userId}/avatar`,
        formData,
      )
      // response.item.avatar_url is the new URL
      setUserData((prev) => ({
        ...prev,
        avatar_url: response.item.avatar_url,
      }))
      setAvatarSuccess('Profile picture updated!')
      setTimeout(() => setAvatarSuccess(null), 3000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAvatarError(err.message);
      } else {
        setAvatarError('Upload failed');
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch {
      setError('Failed to logout')
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) {
      setError('Could not delete account: User ID is missing')
      return
    }
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        await api.delete(`/users/${userId}`)

        await logout()
        navigate('/')
      } catch {
        setError('Failed to delete account')
      }
    }
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <SettingsIcon size={24} />
          <h1>{t('settings.title')}</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <SettingsSection title={t('Profile Picture')} icon={<User size={18} />}>
          <div className="avatar-upload-container">
            <img
              src={
                userData.avatar_url
                  ? `https://localhost:3001${userData.avatar_url}`
                  : '/placeholder-avatar1.png'
              }
              alt="Current avatar"
              className="avatar-preview"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-file-input"
            />
          </div>
          {avatarError && <div className="error-message">{avatarError}</div>}
          {avatarSuccess && (
            <div className="success-message">{avatarSuccess}</div>
          )}
        </SettingsSection>

        <SettingsSection
          title={t('Account Settings')}
          icon={<User size={18} />}
        >
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

        <SettingsSection
          title="Two-Factor Authentication"
          icon={<Lock size={18} />}
        >
          {twoFaEnabled ? (
            <button className="settings-button delete" onClick={disable2FA}>
              Disable 2FA
            </button>
          ) : (
            <>
              <button className="settings-button" onClick={enable2fa}>
                Enable 2FA
              </button>
              {qrDataUrl && (
                <div className="qr-section">
                  <img src={qrDataUrl} alt="Scan to setup 2FA" />
                  <input
                    type="text"
                    value={twoFaToken}
                    onChange={(e) => setTwoFaToken(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 2FA code"
                    className="field-input"
                  />
                  <button className="save-button" onClick={verify2FA}>
                    Verify & Enable
                  </button>
                  {twoFaMessage && (
                    <p className="success-message">{twoFaMessage}</p>
                  )}
                </div>
              )}
            </>
          )}
        </SettingsSection>

        <SettingsSection
          title={t('Language Preferences')}
          icon={<Globe size={18} />}
        >
          <div className="form-group">
            <label htmlFor="language">{t('languages.language')}</label>
            <select
              id="language"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="form-group input"
            >
              <option value="en">{t('languages.english')}</option>
              <option value="fi">{t('languages.finnish')}</option>
              <option value="sv">{t('languages.swedish')}</option>
              <option value="ja">{t('languages.japanese')}</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title={t('Theme Settings')} icon={<Moon size={18} />}>
          <div className="form-group">
            <label htmlFor="theme">{t('Theme')}</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="form-group input"
            >
              <option value="Dark">{t('Dark')}</option>
              <option value="Light">{t('Light')}</option>
              <option value="System">{t('System Default')}</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection
          title={t('Account Management')}
          icon={<User size={18} />}
        >
          <button className="settings-button" onClick={handleLogout}>
            <LogOut size={16} />
            {t('actions.logout')}
          </button>
          <button
            className="settings-button delete"
            onClick={handleDeleteAccount}
          >
            <Trash2 size={16} />
            {t('actions.deleteAccount')}
          </button>
        </SettingsSection>
      </div>
    </div>
  )
}
