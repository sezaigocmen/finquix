/** Figma: "Alt bar" – 5 ikon, seçili sekmenin üstünde lacivert çizgi */
import { motion } from 'motion/react'
import type { NavApi } from '../../shell/navigation'
import home from '../../assets/icons/tab-home.svg'
import analysis from '../../assets/icons/tab-analysis.svg'
import goals from '../../assets/icons/tab-goals.svg'
import budget from '../../assets/icons/tab-budget.svg'
import profile from '../../assets/icons/tab-profile.svg'

const TABS = [
  { id: 'home', label: 'Home', icon: home, size: [33, 30] },
  { id: 'analysis', label: 'Analysis', icon: analysis, size: [38, 29] },
  { id: 'goals', label: 'Pocket Goals', icon: goals, size: [30, 29] },
  { id: 'budget', label: 'Budget', icon: budget, size: [26, 30] },
  { id: 'profile', label: 'Profile', icon: profile, size: [25, 30] },
] as const

/** Sayfa içeriğinin alt menünün arkasında kalmaması için bırakılacak boşluk */
export const TAB_BAR_SPACE = 'calc(49px + max(var(--safe-bottom), 8px) + 12px)'

export function TabBar({ nav }: { nav: NavApi }) {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-[200] bg-[#f6f6f6]/95 backdrop-blur"
      style={{ paddingBottom: 'max(var(--safe-bottom), 8px)', boxShadow: '0 -0.5px 0 rgb(0 0 0 / 0.08)' }}
    >
      <div className="flex h-[49px] items-stretch">
        {TABS.map((t) => {
          const selected = nav.tab === t.id
          return (
            <button
              key={t.id}
              aria-label={t.label}
              aria-current={selected ? 'page' : undefined}
              onClick={() => nav.setTab(t.id)}
              className="pressable relative flex flex-1 items-center justify-center"
            >
              {selected && <motion.span layoutId="tab-indicator" className="absolute left-1/2 top-0 h-[1.5px] w-[67px] -translate-x-1/2 bg-navy" />}
              <img src={t.icon} alt="" style={{ width: t.size[0], height: t.size[1], opacity: selected ? 1 : 0.75 }} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
