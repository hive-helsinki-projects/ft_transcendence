import React, { useEffect } from 'react';
import "../css/LandingPage.css"; // should I move this to its own css file

const clientId = '847383291975-9ten21d8j1vf3m2m1kod2i2js9c28o6e.apps.googleusercontent.com';

// Display the google signin button and tell the parent component if the signin succeeed or not

interface GoogleSignInProps {
    isLoading: boolean;
  }

declare global {
    interface Window {
      gapi: any;
    }
  }

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ isLoading }) => {
    // to init google sign-in client
    useEffect(() => {
        if (window.gapi) {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: clientId,
                    redirect_uri: 'http://localhost:5173'
                });
            });
        } else {
            console.log('Google API is not loaded');
        }
    }, [])

    const handleLogin = () => {
        console.log('Google signin buton are pressed!');
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signIn().then(
            (googleUser: any) => {
                const id_token = googleUser.getAuthResponse().id_token;
                console.log('Google TD Token: ', id_token);
                // send the token to the server
                // sendTokenToBackend(id_token);
                // navigate('/dashboard') // do we need it?
            },
            (error: any) => {
                console.log('Login error: ', error); // do error handlings
            }
        );
    };

  return (
    <div>
        <button
            onClick={handleLogin}
            type="button"
            className="google-button"
            disabled={isLoading}
        >
        <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google"
            width="20"
            height="20"
            />
            Sign in with Google
        </button>
    </div>
  )
}

export default GoogleSignIn
