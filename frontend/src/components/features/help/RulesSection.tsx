import React from 'react'
import { useTranslate } from '@hooks/index'

interface GameRule {
  title: string
  description: string
}

interface RulesSectionProps {
  rules: GameRule[]
}

export const RulesSection: React.FC<RulesSectionProps> = ({ rules }) => {
  const t = useTranslate()
  return (
    <section className="help-section">
      <h2>{t('Game Rules')}</h2>
      <div className="rules-list">
        {rules.map((rule, index) => (
          <div key={index} className="rule-item">
            <h3 className="rule-title">{t(rule.title)}</h3>
            <p className="rule-description">{t(rule.description)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

