import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

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

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ isLoading }) => {
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

  const sendTokenToServer = async (idToken: string) => {
    try {
      console.log("You're in sentTokenToServer function!");
      const response = await fetch('https://172.18.0.2:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User authenticated:', data);
        navigate('/dashboard');
      } else {
        console.log('Authentication failed:', data);
      }
    } catch (error) {
      console.error("Error sending token to server: ", error);
    }
  };

  const handleCredentialResponse = (response: any) => {
    console.log("isLoading is:", isLoading); // for debugging
    
      if (isLoading) {
          return ;
      }
    const idToken = response.credential; // obtain the ID
    console.log("Google ID Token: ", idToken); // for debugging

    // send the token to the sever
    sendTokenToServer(idToken);

  };

  return (
    <div>
      <div id="google-signin-btn"></div> {/* display button here */}
    </div>
  );
};

export default GoogleSignIn
