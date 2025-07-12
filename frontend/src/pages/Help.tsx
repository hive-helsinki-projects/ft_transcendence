import React from 'react'
import '@assets/styles/Help.css'
import { useTranslate } from '@hooks/index'

export const Help: React.FC = () => {
  const t = useTranslate()
  return (
    <div className="help-page">
      <h1>{t('Help Center')}</h1>
      <p>{t('help.description')}</p>
      
      <h2>{t('Game Rules')}</h2>
      <h3>{t('rules.basic.title')}</h3>
      <p>{t('rules.basic.description')}</p>
      
      <h3>{t('rules.scoring.title')}</h3>
      <p>{t('rules.scoring.description')}</p>

      <h2>{t('Frequently Asked Questions')}</h2>
      <h3>{t('faq.start.question')}</h3>
      <p>{t('faq.start.answer')}</p>
      
      <h3>{t('faq.tournaments.question')}</h3>
      <p>{t('faq.tournaments.answer')}</p>

      <h2>{t('Troubleshooting')}</h2>
      <ul>
        <li>{t('troubleshooting.step1')}</li>
        <li>{t('troubleshooting.step2')}</li>
        <li>{t('troubleshooting.step3')}</li>
        <li>{t('troubleshooting.step4')}</li>
        <li>{t('troubleshooting.step5')}</li>
      </ul>
    </div>
  )
}
