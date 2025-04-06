import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Ping. Pong. Play!</h1>
        <h2>Level Up Your Ping Pong Skills</h2>
        <p>
          Smash, spin, and dominate the table. Prove you're the ultimate paddle master.
        </p>

        <div>
          <Card title="For existing users" buttonText="Let's Play" navigateTo="/dashboard"/>
          <Card title="Don't have an account?" buttonText="Register" navigateTo="/register" />
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; buttonText: string; navigateTo?: string }> = ({ title, buttonText, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div>
      <p>{title}</p>
      <button onClick={handleClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default LandingPage;