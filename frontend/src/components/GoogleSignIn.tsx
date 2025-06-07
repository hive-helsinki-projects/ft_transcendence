import React from 'react';
import { googleButton } from '../assets/styles/GoogleSignIn.style';

const clientId = '847383291975-9ten21d8j1vf3m2m1kod2i2js9c28o6e.apps.googleusercontent.com';

const GoogleSignIn: React.FC = () => {
  const redirectToGoogleOAuth = () => {
    const redirectUri = 'https://localhost:5173/oauth2callback'; // The uri we registered in Google Cloud Console
    const scope = 'openid email profile';
    const responseType = 'code';
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  return (
    <>
    <div>
        <button
          onClick={redirectToGoogleOAuth}
          // disabled={isLoading}
          type="button"
          className={googleButton}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-5 h-5 rounded-full"
          />
          Sign in with Google
        </button>
      </div>
      </>
  );
};

export default GoogleSignIn;
