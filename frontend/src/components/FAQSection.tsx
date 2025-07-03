import React from 'react'
import { FAQ } from '@utils/constants'

interface FAQSectionProps {
  faqs: typeof FAQ
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => (
  <section className="help-section">
    <h2>FAQs</h2>
    <ul className="help-list">
      {faqs.map((faq, index) => (
        <li key={index} className="help-item">
          <strong>{faq.question}</strong>
          <p>{faq.answer}</p>
        </li>
      ))}
    </ul>
  </section>
)

export default FAQSection
