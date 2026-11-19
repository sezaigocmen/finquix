import type { ReactNode } from 'react'
import { Header } from './Header'
import { TAB_BAR_SPACE } from './TabBar'

/** Standart sekme ekranı: üstte gri bar, altında kaydırılabilir içerik */
export function ScreenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-bg">
      <Header />
      <main className="scroll-y min-h-0 flex-1" style={{ paddingBottom: TAB_BAR_SPACE }}>
        {children}
      </main>
    </div>
  )
}

/** Geri oku */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button aria-label="Back" onClick={onClick} className="pressable -ml-2 flex h-10 w-10 items-center justify-center">
      <svg width="11" height="19" viewBox="0 0 11 19" fill="none" aria-hidden>
        <path d="M9.5 1.5 2 9.5l7.5 8" stroke="#144748" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
