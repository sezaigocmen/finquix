import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import { Navigator, type ScreenMap, type TabDef } from '../shell/navigation'
import { TabBar } from './components/TabBar'
import { Profile } from './profile/Profile'
import { SideMenuHost } from './components/SideMenu'
import { ConfirmHost } from './components/Confirm'
import { Splash } from './onboarding/Splash'
import { Login } from './onboarding/Login'
import { ConnectBank } from './onboarding/ConnectBank'
import { useFin } from './store'
import { Dashboard } from './home/Dashboard'
import { Analysis } from './analysis/Analysis'
import { Transactions } from './analysis/Transactions'
import { PocketGoals } from './goals/PocketGoals'
import { Budget } from './budget/Budget'
import { BudgetCategory } from './budget/BudgetCategory'

/* ── 1) Giriş akışı: (açılış) → giriş → banka bağlama (alt menü yok) ── */
const introTabs: TabDef[] = [{ id: 'intro', screen: 'login' }]
const introScreens: ScreenMap = {
  login: Login,
  connect: ConnectBank,
}

/* ── 2) Ana uygulama: 5 sekme ── */
const tabs: TabDef[] = [
  { id: 'home', screen: 'home' },
  { id: 'analysis', screen: 'analysis' },
  { id: 'goals', screen: 'goals' },
  { id: 'budget', screen: 'budget' },
  { id: 'profile', screen: 'profile' },
]
const screens: ScreenMap = {
  home: Dashboard,
  analysis: Analysis,
  transactions: Transactions,
  goals: PocketGoals,
  budget: Budget,
  'budget-category': BudgetCategory,
  profile: Profile,
}

export function App() {
  const onboarded = useFin((s) => s.onboarded)
  const [splash, setSplash] = useState(!onboarded)
  const hideSplash = useCallback(() => setSplash(false), [])

  return (
    <>
      <AnimatePresence initial={false}>
        <motion.div
          key={onboarded ? 'main' : 'intro'}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        >
          {onboarded ? (
            <>
              <Navigator tabs={tabs} initialTab="home" screens={screens} tabBar={(nav) => <TabBar nav={nav} />} />
              <SideMenuHost />
              <ConfirmHost />
            </>
          ) : (
            <Navigator tabs={introTabs} initialTab="intro" screens={introScreens} />
          )}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>{splash && <Splash key="splash" onDone={hideSplash} />}</AnimatePresence>
    </>
  )
}
