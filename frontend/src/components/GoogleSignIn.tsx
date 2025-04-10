import React, { useEffect } from 'react';

// Display the google signin button and tell the parent component if the signin succeeed or not
const GoogleSignIn = () => {
    // to init google sign-in client
    useEffect(() => {
        window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
                client_id: 'YOUR_GOOGLE_CLIENT_ID' // modify this part
            });
        });
    }, [])

    const handleLogin = () => {
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signIn().then(
            (googleUser: any) => {
                const id_token = googleUser.getAuthResponse().id_token;
                console.log('Google TD Token: ', id_token);
                // send the token to the server
            },
            (error: any) => {
                console.log('Login error: ', error);
            }
        );
    };

  return (
    <div>
        <button onClick={handleLogin}>Google Login</button>
    </div>
  )
}

export default GoogleSignIn
