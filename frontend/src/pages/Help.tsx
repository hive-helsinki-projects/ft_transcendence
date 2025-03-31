import React from "react";

const Help: React.FC = () => {

  const gameRules = [
        "The game is played between two players.",
        "Each player takes turns hitting the ball across the table.",
        "The ball must bounce once on the opponent's side of the table before they return it.",
        "A point is scored if the opponent fails to return the ball or hits it out of bounds.",
        "The first player to reach 11 points with a 2-point lead wins the game.",
        "If the score reaches 10-10, the game continues until one player has a 2-point lead.",
      ];

  const faqs = [
    {
      question: "How do I register an account?",
      answer: "Click on the 'Register' button on the landing page and fill out the form.",
    },
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click on 'Forgot Password' to reset your password.",
    },
    {
      question: "How do I start a game?",
      answer: "Navigate to the 'Game' section from the sidebar and click 'Start Game'.",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Help Center</h1>
      <p>Find answers to common questions or contact support for further assistance.</p>

      <h2>Game Rules</h2>
      <ul>
        {gameRules.map((rule, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            {rule}
          </li>
        ))}
      </ul>

      <h2>FAQs</h2>
      <ul>
        {faqs.map((faq, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </li>
        ))}
      </ul>

      <h2>Contact Support</h2>
      <p>
        If you need further assistance, please contact us at{" "}
        <a href="mailto:support@example.com">support@example.com</a>.
      </p>

      <h2>Troubleshooting</h2>
      <p>
        If you encounter any issues, try the following steps:
        <ul>
          <li>Ensure you have a stable internet connection.</li>
          <li>Clear your browser cache and cookies.</li>
          <li>Restart the application.</li>
        </ul>
      </p>

      <h2>Feedback</h2>
      <p>
        We value your feedback! Please let us know how we can improve by submitting your feedback
        <a href="/feedback"> here</a>.
      </p>
    </div>
  );
};

export default Help;