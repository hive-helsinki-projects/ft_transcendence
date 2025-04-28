import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import "../css/LandingPage.css";
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

  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
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
      const response = await fetch('https://localhost:3001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken })
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user.token, data.user.username);
        navigate('/dashboard');
      } else {
        console.log('Authentication failed:', data);
      }
    } catch (error) {
      console.error("Error sending token to server: ", error);
    }
  };

  const handleCredentialResponse = (response: any) => {    
      if (isLoading) {
          return ;
      }
    const idToken = response.credential; // obtain the ID

    // send the token to the sever
    sendTokenToServer(idToken).then(() => {
      navigate('/dashboard');
    }).catch((error) => {
      console.error("Error sending token to server: ", error);
    })
  };

  return (
    <div>
      <div id="google-signin-btn"></div>
    </div>
  );
};

export default GoogleSignIn
