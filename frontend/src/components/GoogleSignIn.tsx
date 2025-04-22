import React, { useEffect } from 'react';
import "../css/LandingPage.css"; // should I move this to its own css file?

const clientId = '847383291975-9ten21d8j1vf3m2m1kod2i2js9c28o6e.apps.googleusercontent.com';

interface GoogleSignInProps {
  isLoading: boolean;
}

declare global {
  interface Window {
      google: any;
  }
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ( {isLoading} ) => {
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        { theme: "outline", size: "large" }
      );
    } else {
      console.error("Google Identity SDK is not loaded.");
    }
  }, []);

  const handleCredentialResponse = (response: any) => {
      if (isLoading) {
          return ;
      }
    const idToken = response.credential; // obtain the ID
    console.log("Google ID Token: ", idToken); // for debugging

    // send the token to the sever
    sendTokenToServer(idToken);

  };

  const sendTokenToServer = (idToken: string) => {
    try {
      console.log("test test!!");
    } catch (error) {
      console.error("test test!!");
    }
  }

  return (
    <div>
      <div id="google-signin-btn"></div> {/* display button here */}
    </div>
  );
};

export default GoogleSignIn
