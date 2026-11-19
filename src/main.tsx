import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppShell } from './shell/AppShell'
import type { ShowcaseMeta } from './shell/InfoPanel'
import { App } from './app/App'
import { resetDemo } from './app/store'
import logo from './assets/logo-mark.png'

/** Masaüstü tanıtım paneli bilgileri (her projede burası değişir) */
const meta: ShowcaseMeta = {
  name: 'FinQuix',
  tagline: 'Financial clarity, not another wallet',
  description: 'All your bank accounts in one place, with clear spending insights, budgets with smart alerts and Pocket Goals for saving with purpose.',
  logo,
  accent: '#144748',
  pageBackground: 'radial-gradient(900px 600px at 15% 15%, #DCE8E8 0%, transparent 60%), radial-gradient(700px 500px at 90% 90%, #DDE5F0 0%, transparent 60%), #F3F6F6',
  designer: 'Sezai Göçmen',
  links: [{ label: 'Full case study', href: 'https://www.sezaigocmen.com/projects/finquix' }],
  onReset: resetDemo,
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppShell meta={meta}>
      <App />
    </AppShell>
  </StrictMode>,
)
