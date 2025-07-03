import React from 'react'
import '@assets/styles/index.css'
import { useTranslate } from '@hooks/index'

const HeroSection: React.FC = () => {
  const t = useTranslate()

  return (
    <section className="hero-section">
      <h1>{t('hero.title')}</h1>
      <h2>{t('hero.subtitle')}</h2>
      <p>{t('hero.description')}</p>
    </section>
  )
}

export default HeroSection
