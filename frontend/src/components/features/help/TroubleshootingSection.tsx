import React from 'react'
import { useTranslate } from '@hooks/index'

interface TroubleshootingSectionProps {
  steps: string[]
}

export const TroubleshootingSection: React.FC<TroubleshootingSectionProps> = ({
  steps,
}) => {
  const t = useTranslate()
  return (
    <section className="help-section">
      <h2>{t('Troubleshooting')}</h2>
      <ul className="help-list">
        {steps.map((step, index) => (
          <li key={index} className="help-item">
            {t(step)}
          </li>
        ))}
      </ul>
    </section>
  )
}
