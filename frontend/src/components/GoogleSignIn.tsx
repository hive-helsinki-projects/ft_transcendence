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


  const GoogleSignIn: React.FC<GoogleSignInProps> = ( {isLoading} ) => {
    useEffect(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"), // ボタンを表示する要素のID
          { theme: "outline", size: "large" }           // ボタンのスタイルオプション
        );
      } else {
        console.error("Google Identity SDK is not loaded.");
      }
    }, []);
  
    const handleCredentialResponse = (response: any) => {
        if (isLoading) {
            return ;
        }
      const idToken = response.credential; // ID トークンを取得
      console.log("Google ID Token: ", idToken);
      // サーバーにトークンを送信してユーザーを認証する
    };
  
    return (
      <div>
        <div id="google-signin-btn"></div> {/* Google サインインボタンをここに表示 */}
      </div>
    );
  };

// const GoogleSignIn: React.FC<GoogleSignInProps> = ({ isLoading }) => {
//     // to init google sign-in client
//     useEffect(() => {
//         if (window.gapi) {
//             window.gapi.load('auth2', () => {
//                 window.gapi.auth2.init({
//                     client_id: clientId,
//                     // redirect_uri: 'http://localhost:5173/dashboard'
//                 });
//             });
//         } else {
//             console.log('Google API is not loaded');
//         }
//     }, [])

//     const handleLogin = () => {
//         if (isLoading) {
//             return ;
//         }
//         console.log('Google signin button are pressed!'); // for debugging
//         const auth2 = window.gapi.auth2.getAuthInstance();
//         console.log(auth2);
//         auth2.signIn().then(
//             (googleUser) => {
//                 const id_token = googleUser.getAuthResponse().id_token;
//                 console.log('Google ID Token: ', id_token);
//                 // send the token to the server
//                 // sendTokenToBackend(id_token);
//             },
//             (error) => {
//                 console.log('Login error: ', error); // do error handlings
//             }
//         );
//     };

//   return (
//     <div>
//         <button
//             onClick={handleLogin}
//             type="button"
//             className="google-button"
//             disabled={isLoading}
//         >
//         <img 
//             src="https://www.google.com/favicon.ico" 
//             alt="Google"
//             width="20"
//             height="20"
//             />
//             Sign in with Google
//         </button>
//     </div>
//   )
// }

export default GoogleSignIn
