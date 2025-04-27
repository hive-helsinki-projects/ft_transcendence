import React from 'react'

interface TroubleshootingSectionProps {
  steps: string[]
}

const TroubleshootingSection: React.FC<TroubleshootingSectionProps> = ({
  steps,
}) => {
  return (
    <section className="help-section">
      <h2>Troubleshooting</h2>
      <ul className="help-list">
        {steps.map((step, index) => (
          <li key={index} className="help-item">
            {step}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TroubleshootingSection 