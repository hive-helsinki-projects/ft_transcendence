import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div>
      <div>
        <h1>Ping. Pong. Play!</h1>
        <h2>Level Up Your Ping Pong Skills</h2>
        <p>
          Smash, spin, and dominate the table. Prove you’re the ultimate paddle master.
        </p>

        <div>
          <Card title="For existing users" buttonText="Let’s Play" />
          <Card title="Don’t have an account?" buttonText="Register" />
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; buttonText: string }> = ({ title, buttonText }) => (
  <div>
    <p>{title}</p>
    <button>
      {buttonText}
    </button>
  </div>
);

export default LandingPage;