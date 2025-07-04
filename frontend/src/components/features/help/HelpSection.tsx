import React from 'react'

interface HelpSectionProps {
  title: string
  description: string
}

export const HelpSection: React.FC<HelpSectionProps> = ({ title, description }) => {
  return (
    <section className="help-section">
      <h1>{title}</h1>
      <p className="help-intro">{description}</p>
    </section>
  )
}
