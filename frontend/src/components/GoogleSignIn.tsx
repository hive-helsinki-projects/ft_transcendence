import React, { useEffect } from 'react';
import "../css/LandingPage.css"; // should I move this to its own css file

// Display the google signin button and tell the parent component if the signin succeeed or not

interface GoogleSignInProps {
    isLoading: boolean;
}

interface Window {
    gapi: any;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ isLoading }) => {
    // to init google sign-in client
    useEffect(() => {
        if (window.gapi) {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID' // modify this part
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
