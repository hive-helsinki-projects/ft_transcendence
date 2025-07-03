import React from 'react'
import { LoadingContainer } from '../components'
import { HelpSection, FAQSection, RulesSection, ContactSection, TroubleshootingSection, FeedbackSection } from '../components/features/help'
import { FAQ, gameRules, troubleshootingSteps } from '@utils/constants'
import '../assets/styles/index.css'

const Help: React.FC = () => {
  return (
    <LoadingContainer>
      <div className="help-container">
        <HelpSection
          title="Help Center"
          description="Find answers to common questions or contact support for further assistance."
        />
        
        <RulesSection rules={gameRules} />
        <FAQSection faqs={FAQ} />
        
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