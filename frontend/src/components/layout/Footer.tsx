import { Github } from 'lucide-react'
import React from 'react'
import { useTranslate } from '@hooks/useTranslate'

/**
 * Footer Component
 * Simple footer with copyright and friendly message
 */

interface Developer {
  name: string
  url: string
}

const DEVELOPERS: Developer[] = [
  { name: 'Miyuki Ito', url: 'https://github.com/ito-miyuki' },
  { name: 'Kim Matjuhin', url: 'https://github.com/k2matu' },
  { name: 'Valle Vaalanti', url: 'https://github.com/Vallehtelia' },
  { name: 'Oliver Hertzberg', url: 'https://github.com/oliverhertzberg' },
  { name: 'Lumi Kilpeläinen', url: 'https://github.com/lkilpela' },
]

export const Footer: React.FC = () => {
  const t = useTranslate()
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Ping.Pong.Play! - Hive Helsinki. {t('footer.allRightsReserved')}</p>
        <div className="footer-developers-row">
          <span className="footer-developers-label">{t('footer.developers')}:</span>
          {DEVELOPERS.map((dev: Developer) => (
            <a
              key={dev.url}
              href={dev.url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-developers-link"
              aria-label={`${dev.name} GitHub Profile`}
              title={dev.name}
            >
              <Github className="h-5 w-5" />
            </a>
          ))}
        </div>
        <p>{t('footer.madeWithLove')}</p>
      </div>
    </footer>
  )
} 