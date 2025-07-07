import React from 'react'
import useTranslate from '../../../hooks/useTranslate'

interface GameRule {
  title: string
  description: string
}

interface RulesSectionProps {
  rules: GameRule[]
}

const RulesSection: React.FC<RulesSectionProps> = ({ rules }) => {
  const t = useTranslate()
  return (
    <section className="help-section">
      <h2>{t('Game Rules')}</h2>
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

export default RulesSection 