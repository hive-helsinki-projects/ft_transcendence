import React from 'react'

interface ContactSectionProps {
  title: string
  description: string
  email: string
}

const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  description,
  email,
}) => {
  return (
    <section className="help-section">
      <h2>{title}</h2>
      <p>
        {description}{' '}
        <a href={`mailto:${email}`} className="help-link">
          {email}
        </a>
        .
      </p>
    </section>
  )
}

export default ContactSection 