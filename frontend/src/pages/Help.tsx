import React from 'react'
import '../css/Help.css'
import FAQSection from '../components/FAQSection'
import RulesSection from '../components/RulesSection'
import { faqs, gameRules, troubleshootingSteps } from '../data/helpData'

const Help: React.FC = () => {
  return (
    <div className="help-container">
      <section className="help-section">
        <h1>Help Center</h1>
        <p className="help-intro">
          Find answers to common questions or contact support for further
          assistance.
        </p>
      </section>

      <RulesSection rules={gameRules} />
      <FAQSection faqs={faqs} />

      <section className="help-section">
        <h2>Contact Support</h2>
        <p>
          If you need further assistance, please contact us at{' '}
          <a href="mailto:support@example.com" className="help-link">
            support@example.com
          </a>
          .
        </p>
      </section>

      <section className="help-section">
        <h2>Troubleshooting</h2>
        <ul className="help-list">
          {troubleshootingSteps.map((step, index) => (
            <li key={index} className="help-item">
              {step}
            </li>
          ))}
        </ul>
      </section>

      <section className="help-section">
        <h2>Feedback</h2>
        <p>
          We value your feedback! Please let us know how we can improve by
          submitting your feedback{' '}
          <a href="/feedback" className="help-link">
            here
          </a>
          .
        </p>
      </section>
    </div>
  )
}

export default Help
