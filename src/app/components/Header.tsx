/** Figma: 4-dashboard üst bar – gri zemin, solda menü, sağda (bildirim) + AI asistan + avatar */
import { useNav } from '../../shell/navigation'
import { openInsights } from './Insights'
import { BellButton } from './Notifications'
import { openMenu } from './SideMenu'
import assistant from '../../assets/icons/assistant.svg'
import avatar from '../../assets/avatar-lucas.jpg'

export function Header() {
  const nav = useNav()
  return (
    <header className="relative z-10 shrink-0 bg-bar" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="flex h-[49px] items-center justify-between pl-[14px] pr-[8px]">
        <button aria-label="Menu" onClick={() => openMenu(nav)} className="pressable flex h-10 w-10 flex-col items-center justify-center gap-[5px]">
          <span className="h-px w-[19px] bg-ink" />
          <span className="h-px w-[19px] bg-ink" />
          <span className="h-px w-[19px] bg-ink" />
        </button>
        <div className="flex items-center gap-[9px]">
          <BellButton nav={nav} />
          <button aria-label="AI insights" onClick={() => openInsights(nav)} className="pressable">
            <img src={assistant} alt="" className="h-[29px] w-[33px]" />
          </button>
          <button aria-label="Profile" onClick={() => nav.setTab('profile')} className="pressable">
            <img src={avatar} alt="" className="h-[32px] w-[32px] rounded-full border border-brand object-cover" />
          </button>
        </div>
      </div>
    </header>
  )
}
