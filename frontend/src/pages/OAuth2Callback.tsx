import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/auth/useAuth';

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      console.error("it doesn't find the code");
      return;
    }

    fetch('https://localhost:3001/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.user?.token) {
          login(data.user.token, data.user.username, data.user.id);
          navigate('/dashboard');
        } else {
          console.error("Failed to login:", data);
          navigate('/login');
        }
      })
      .catch(err => {
        console.error("Error:", err);
        navigate('/login');
      });
  }, [navigate, login]);

  return (
    <p>Loging in...</p>
  )
};

export default OAuth2Callback;
