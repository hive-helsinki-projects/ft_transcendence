import { FAQ, gameRules, troubleshootingSteps } from '@utils/constants'
import React from 'react'
import {
  FAQSection,
  HelpSection,
  RulesSection,
  TroubleshootingSection,
} from '@components/features/help'
import { useTranslate } from '@hooks/index'

export const Help: React.FC = () => {
  const t = useTranslate()
  return (
    <div className="help-container">
      <HelpSection
        title={t('Help Center')}
        description={t('help.description')}
      />

      <RulesSection rules={gameRules} />
      <FAQSection faqs={FAQ} />

      <TroubleshootingSection steps={troubleshootingSteps} />
    </div>
  )
}
