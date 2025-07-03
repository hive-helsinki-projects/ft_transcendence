import React from 'react'

interface GameRule {
  title: string
  description: string
}

interface RulesSectionProps {
  rules: GameRule[]
}

export const RulesSection: React.FC<RulesSectionProps> = ({ rules }) => {
  return (
    <section className="help-section">
      <h2>Game Rules</h2>
      <div className="rules-list">
        {rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <h3 className="rule-title">{rule.title}</h3>
            <p className="rule-description">{rule.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
