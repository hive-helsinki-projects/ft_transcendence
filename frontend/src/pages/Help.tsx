import { FAQ, gameRules, troubleshootingSteps } from '@utils/constants'
import React from 'react'
import {
  ContactSection,
  FAQSection,
  FeedbackSection,
  HelpSection,
  RulesSection,
  TroubleshootingSection,
} from '@components/features/help'

export const Help: React.FC = () => {
  return (
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
  )
}
