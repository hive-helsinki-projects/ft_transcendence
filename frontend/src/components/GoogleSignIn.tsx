import React from 'react';

const GoogleSignIn: React.FC = () => {
  const redirectToGoogleOAuth = () => {
    const redirectUri = 'https://localhost:5173/oauth2callback'; // The uri we registered in Google Cloud Console
    const scope = 'openid email profile';
    const responseType = 'code';
    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: responseType,
      scope: scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  return (
      <div>
        <button onClick={redirectToGoogleOAuth}>
          Login with Google(test redirect method)
        </button>
      </div>
  );
};

export default GoogleSignIn;
