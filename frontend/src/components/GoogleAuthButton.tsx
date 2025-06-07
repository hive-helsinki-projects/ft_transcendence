import React from 'react'

interface GoogleAuthButtonProps {
  isLoading: boolean
  onClick: () => void
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ isLoading, onClick }) => (
  <button
    type="button"
    className="google-button"
    onClick={onClick}
    disabled={isLoading}
  >
    <img
      src="https://www.google.com/favicon.ico"
      alt="Google"
      width="20"
      height="20"
    />
    Sign up with Google
  </button>
  
) 