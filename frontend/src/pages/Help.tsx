import React from 'react'
import { LoadingContainer } from '../components'
import { HelpSection, FAQSection, RulesSection, ContactSection, TroubleshootingSection, FeedbackSection } from '../components/features/help'
import { faqs, gameRules, troubleshootingSteps } from '../data/helpData'
import '../assets/styles/index.css'
import useTranslate from '../hooks/useTranslate'

const Help: React.FC = () => {
  const t = useTranslate()

  return (
    <LoadingContainer>
      <div className="help-container">
        <HelpSection
          title={t('Help Center')}
          description={t('help.description')}
        />
        
        <RulesSection rules={gameRules} />
        <FAQSection faqs={faqs} />
        
        <ContactSection
          email="support@example.com"
          title="Contact Support"
          description="If you need further assistance, please contact us at"
        />
        
        <TroubleshootingSection steps={troubleshootingSteps} />
        
        <FeedbackSection
          title="Feedback"
          description="We value your feedback! Please let us know how we can improve by submitting your feedback"
          linkText="here"
          linkPath="/feedback"
        />
      </div>
    </LoadingContainer>
  )
}

export default Help