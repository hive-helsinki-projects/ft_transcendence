import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const LandingPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }

      const response = await api.login(username, password);
      login(response.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1>Ping. Pong. Play!</h1>
          <h2>Level Up Your Ping Pong Skills</h2>
          <p>
            Smash, spin, and dominate the table. Prove you're the ultimate paddle master.
          </p>
        </div>
      </div>

      <div>
        <div>
          <h2>Let's Play!</h2>

          {error && <div>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div>
            <div>
              <span>Or continue with</span>
            </div>

            <div>
              <button onClick={() => {/* Handle Google Auth */}} disabled={isLoading}>
                Sign in with Google
              </button>
            </div>

            <div>
              <span>Or</span>
            </div>

            <div>
              <button onClick={() => navigate('/register')} disabled={isLoading}>
                Don't have an account?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;