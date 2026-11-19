/** Öneri: Yan menü – ☰ ikonundan soldan kayarak açılır */
import { AnimatePresence, motion } from 'motion/react'
import { create } from 'zustand'
import type { NavApi } from '../../shell/navigation'
import { TOTAL_BALANCE, money } from '../data/finance'
import { resetDemo } from '../store'
import { openDemoNotice } from './DemoNotice'
import { openInsights } from './Insights'
import { openNotifications } from './Notifications'
import avatar from '../../assets/avatar-lucas.jpg'
import logo from '../../assets/logo-mark.png'
import tabHome from '../../assets/icons/tab-home.svg'
import tabAnalysis from '../../assets/icons/tab-analysis.svg'
import tabGoals from '../../assets/icons/tab-goals.svg'
import tabBudget from '../../assets/icons/tab-budget.svg'
import tabProfile from '../../assets/icons/tab-profile.svg'
import assistant from '../../assets/icons/assistant.svg'

const useMenu = create<{ nav: NavApi | null }>(() => ({ nav: null }))
export const openMenu = (nav: NavApi) => useMenu.setState({ nav })
const closeMenu = () => useMenu.setState({ nav: null })

const EASE = [0.32, 0.72, 0, 1] as const

export function SideMenuHost() {
  const nav = useMenu((s) => s.nav)
  return (
    <AnimatePresence>
      {nav && (
        <div className="absolute inset-0 z-[450]" key="menu">
          <motion.div className="absolute inset-0 bg-black/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={closeMenu} />
          <motion.nav
            aria-label="Menu"
            className="absolute inset-y-0 left-0 flex w-[78%] max-w-[320px] flex-col bg-white shadow-[8px_0_30px_rgb(0_0_0/0.15)]"
            style={{ paddingTop: 'var(--safe-top)', paddingBottom: 'var(--safe-bottom)' }}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.38, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.6, right: 0 }}
            onDragEnd={(_, i) => {
              if (i.offset.x < -70 || i.velocity.x < -400) closeMenu()
            }}
          >
            <MenuBody nav={nav} />
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  )
}

function MenuBody({ nav }: { nav: NavApi }) {
  /** Menüyü kapatıp işlemi kapanış animasyonundan sonra çalıştırır */
  const then = (fn: () => void) => () => {
    closeMenu()
    setTimeout(fn, 280)
  }
  const tab = (id: string, label: string, icon: string) => (
    <Item key={id} icon={icon} label={label} active={nav.tab === id} onClick={then(() => nav.setTab(id))} />
  )

  return (
    <>
      <button onClick={then(() => nav.setTab('profile'))} className="pressable flex items-center gap-3 bg-bar px-5 pb-4 pt-5 text-left">
        <img src={avatar} alt="" className="h-[52px] w-[52px] rounded-full border border-brand object-cover" />
        <div>
          <p className="text-[17px] font-medium leading-[22px]">Lucas Mores</p>
          <p className="text-[12px] font-light text-black/55">Total balance {money(TOTAL_BALANCE)}</p>
        </div>
      </button>

      <div className="scroll-y min-h-0 flex-1 px-3 py-3">
        {tab('home', 'Home', tabHome)}
        {tab('analysis', 'Analysis', tabAnalysis)}
        {tab('goals', 'Pocket Goals', tabGoals)}
        {tab('budget', 'Budget', tabBudget)}
        {tab('profile', 'Profile', tabProfile)}
        <hr className="mx-3 my-3 border-black/10" />
        <Item label="All transactions" glyph="≡" onClick={then(() => nav.push('transactions', { title: 'All transactions' }))} />
        <Item label="AI Insights" icon={assistant} onClick={then(() => openInsights(nav))} />
        <Item label="Notifications" glyph="◔" onClick={then(() => openNotifications(nav))} />
        <hr className="mx-3 my-3 border-black/10" />
        <Item label="About this demo" glyph="i" onClick={then(() => openDemoNotice(nav, 'About this demo'))} />
        <Item label="Restart demo" glyph="↺" onClick={resetDemo} />
      </div>

      <div className="flex items-center gap-2 px-6 pb-5 pt-2">
        <img src={logo} alt="" className="h-[22px] w-auto" />
        <span className="text-[15px] font-semibold">FinQuix</span>
        <span className="ml-auto text-[11px] font-light text-black/40">Portfolio demo</span>
      </div>
    </>
  )
}

function Item({ label, icon, glyph, active, onClick }: { label: string; icon?: string; glyph?: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`pressable flex h-[46px] w-full items-center gap-3 rounded-card px-3 text-left ${active ? 'bg-brand/[0.08]' : ''}`}>
      <span className="flex h-[26px] w-[28px] items-center justify-center">
        {icon ? <img src={icon} alt="" className="max-h-[24px] max-w-[26px]" /> : <span className="text-[17px] font-medium text-brand">{glyph}</span>}
      </span>
      <span className={`text-[15px] ${active ? 'font-medium text-brand' : 'font-light'}`}>{label}</span>
    </button>
  )
}
