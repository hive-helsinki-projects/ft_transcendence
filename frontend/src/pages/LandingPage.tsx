import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { localAuth } from "../services/localAuth";
import LoadingContainer from '../components/LoadingContainer';
import "../css/LandingPage.css";

import GoogleSignIn from "../components/GoogleSignIn";

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      if (!formData.username || !formData.password) {
        setError("Please fill in all fields");
        return;
      }

      const response = await localAuth.login(formData.username, formData.password);
      setSuccessMessage("Login successful! Redirecting to dashboard...");
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      login(response.token, response.username);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingContainer showPongBackground>
      <section className="hero-section">
        <h1>Ping. Pong. Play!</h1>
        <h2>Level Up Your Ping Pong Skills</h2>
        <p>Smash, spin, and dominate the table. Prove you're the ultimate paddle master.</p>
      </section>

      <section className="auth-section">
        <h2>Let's Play!</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>


        <div className="auth-options">
          <div className="google-auth">
            <span>Or</span>
            {/* <button 
              type="button"
              className="google-button"
              onClick={() => {}}
              disabled={isLoading}
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google"
                width="20"
                height="20"
              />
              Sign in with Google
            </button> */}
            <GoogleSignIn 
              isLoading={isLoading}
            />

          </div>

          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <button 
                type="button"
                className="link-button"
                onClick={() => navigate('/register')}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </section>
    </LoadingContainer>
  );
};

export default LandingPage;