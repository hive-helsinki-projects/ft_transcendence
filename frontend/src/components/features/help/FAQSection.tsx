import React from 'react'
import { useTranslate } from '@hooks/index'

interface FAQ {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const t = useTranslate()
  return (
    <section className="help-section">
      <h2>{t('Frequently Asked Questions')}</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{t(faq.question)}</h3>
            <p className="faq-answer">{t(faq.answer)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
