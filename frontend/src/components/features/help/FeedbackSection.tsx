import React from 'react'
import { Link } from 'react-router-dom'

interface FeedbackSectionProps {
  title: string
  description: string
  linkText: string
  linkPath: string
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  title,
  description,
  linkText,
  linkPath,
}) => {
  return (
    <section className="help-section">
      <h2>{title}</h2>
      <p>
        {description}{' '}
        <Link to={linkPath} className="help-link">
          {linkText}
        </Link>
        .
      </p>
    </section>
  )
}
