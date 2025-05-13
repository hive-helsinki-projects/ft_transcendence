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
import useTranslate from '../hooks/useTranslate';
import i18n from '../i18n/config'

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
}) => {
  const t = useTranslate();

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

const Settings: React.FC = () => {
  const { token, username, logout } = useAuth()
  const navigate = useNavigate()
  const t = useTranslate()

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
  const [language, setLanguage] = useState(i18n.language)
  const [theme, setTheme] = useState('Dark')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [twoFaEnabled, setTwoFaEnabled] = useState<boolean>(false)
  const [qrDataUrl,    setQrDataUrl]    = useState<string | null>(null)
  const [twoFaToken,   setTwoFaToken]   = useState<string>('')
  const [twoFaMessage, setTwoFaMessage] = useState<string | null>(null)

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
        const errorMessage = t('errors.failedToUpdate')
        throw new Error(errorMessage)
      }

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
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

        <SettingsSection title={t('Account Settings')} icon={<User size={18} />}>
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

        <SettingsSection title={t('Two-Factor Authentication')} icon={<Lock size={18} />}>
            { twoFaEnabled ? (
                <>
                <p>2FA is currently <strong>ON</strong>.</p>
                <button
                    className="settings-button delete"
                    onClick={async () => {
                    await fetch('/api/2fa', {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    setTwoFaEnabled(false)
                    }}
                >
                    {t('Disable 2FA')}
                </button>
                </>
            ) : (
                <>
                <button
                    className="settings-button"
                    onClick={async () => {
                    const res = await fetch('/api/2fa/setup', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    if (!res.ok) {
                        const txt = await res.text()
                        console.error('2FA setup failed:', res.status, txt)
                        setTwoFaMessage(`Error ${res.status}: ${txt}`)
                        return
                    }
                    const { qrDataUrl } = await res.json()
                    setQrDataUrl(qrDataUrl)
                    }}
                >
                    {t('Enable 2FA')}
                </button>

                { qrDataUrl && (
                    <div className="qr-section">
                    <img src={qrDataUrl} alt="Scan to setup 2FA" />
                    <input
                        type="text"
                        value={twoFaToken}
                        onChange={e => setTwoFaToken(e.target.value)}
                        maxLength={6}
                        placeholder="Enter code"
                        className="field-input"
                    />
                    <button
                        className="save-button"
                        onClick={async () => {
                        const res = await fetch('/api/2fa/verify', {
                            method: 'POST',
                            headers: {
                            'Content-Type':  'application/json',
                            'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ token: twoFaToken })
                        })
                        if (!res.ok) {
                            const err = await res.json()
                            setTwoFaMessage(err.error)
                        } else {
                            setTwoFaEnabled(true)
                            setQrDataUrl(null)
                            setTwoFaMessage('2FA enabled!')
                        }
                        }}
                    >
                        Verify & Enable
                    </button>
                    { twoFaMessage && <p className="success-message">{twoFaMessage}</p> }
                    </div>
                )}
                </>
            )}
        </SettingsSection>

        <SettingsSection title={t('Language Preferences')} icon={<Globe size={18} />}>
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

        <SettingsSection title={t('Account Management')} icon={<User size={18} />}>
          <button className="settings-button" onClick={handleLogout}>
            <LogOut size={16} />
            {t('actions.logout')}
          </button>
          <button className="settings-button delete" onClick={handleDeleteAccount}>
            <Trash2 size={16} />
            {t('actions.deleteAccount')}
          </button>
        </SettingsSection>
      </div>
    </div>
  )
}

export default Settings
