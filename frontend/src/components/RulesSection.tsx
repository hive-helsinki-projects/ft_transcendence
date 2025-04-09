import React from 'react';

interface RulesSectionProps {
  rules: string[];
}

const RulesSection: React.FC<RulesSectionProps> = ({ rules }) => (
  <section className="help-section">
    <h2>Game Rules</h2>
    <ul className="help-list">
      {rules.map((rule, index) => (
        <li key={index} className="help-item">{rule}</li>
      ))}
    </ul>
  </section>
);

export default RulesSection; 