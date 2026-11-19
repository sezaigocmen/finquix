/** Öneri: Bildirim kutusu – alarm, hedef, gelir ve bütçe bildirimleri (zil ikonundan açılır) */
import type { NavApi } from '../../shell/navigation'
import { ago, type Notif } from '../data/notifications'
import { useFin } from '../store'
import alarmIcon from '../../assets/icons/alarm.svg'
import goalsIcon from '../../assets/icons/tab-goals.svg'
import budgetIcon from '../../assets/icons/tab-budget.svg'
import assistant from '../../assets/icons/assistant.svg'

const KIND: Record<Notif['kind'], { bg: string; icon?: string; text?: string; white?: boolean }> = {
  alarm: { bg: '#BA0808', icon: alarmIcon, white: true },
  goal: { bg: '#14474814', icon: goalsIcon },
  budget: { bg: '#14447314', icon: budgetIcon },
  tip: { bg: '#1346C714', icon: assistant },
  income: { bg: '#2E7C2C1A', text: '$' },
}

/** Zil ikonu + okunmamış rozeti */
export function BellButton({ nav }: { nav: NavApi }) {
  const unread = useFin((s) => s.notifs.filter((n) => !n.read).length)
  return (
    <button aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} onClick={() => openNotifications(nav)} className="pressable relative flex h-[32px] w-[30px] items-center justify-center">
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none" aria-hidden>
        <path d="M10 2.2a6 6 0 0 0-6 6v4.3L2.3 15.6a.8.8 0 0 0 .7 1.2h14a.8.8 0 0 0 .7-1.2L16 12.5V8.2a6 6 0 0 0-6-6Z" stroke="#144748" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M7.6 18.6a2.5 2.5 0 0 0 4.8 0" stroke="#144748" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {unread > 0 && (
        <span className="absolute right-[-2px] top-[1px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-expense px-[3px] text-[11px] font-medium leading-none text-white">
          {unread}
        </span>
      )}
    </button>
  )
}

export function openNotifications(nav: NavApi) {
  // Açılışta okundu sayılır (rozet kaybolur), yeni olanlar bu pencerede vurgulu kalır
  const fresh = new Set(useFin.getState().notifs.filter((n) => !n.read).map((n) => n.id))
  useFin.getState().markAllRead()
  nav.openSheet((close) => <NotificationsSheet close={close} fresh={fresh} />)
}

function NotificationsSheet({ close, fresh }: { close: () => void; fresh: Set<string> }) {
  const notifs = useFin((s) => s.notifs).map((n) => ({ ...n, read: !fresh.has(n.id) }))
  const clearNotifs = useFin((s) => s.clearNotifs)

  return (
    <div className="flex flex-col px-5 pb-6 pt-1">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-medium text-navy">Notifications</h2>
        {notifs.length > 0 && (
          <button onClick={clearNotifs} className="pressable text-[12px] font-light text-black/50">
            Clear all
          </button>
        )}
      </div>
      {notifs.length === 0 ? (
        <p className="py-10 text-center text-[13px] font-light text-black/45">You’re all caught up.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-[6px]">
          {notifs.map((n) => {
            const k = KIND[n.kind]
            return (
              <li key={n.id} className={`flex gap-3 rounded-card px-3 py-[10px] ${n.read ? '' : 'bg-brand/[0.06]'}`}>
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full" style={{ background: k.bg }}>
                  {k.icon ? <img src={k.icon} alt="" className={`h-[20px] w-[20px] object-contain ${k.white ? 'brightness-0 invert' : ''}`} /> : <span className="text-[17px] font-semibold text-income">{k.text}</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] font-medium leading-[19px]">{n.title}</p>
                    {!n.read && <span className="mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full bg-expense" />}
                  </div>
                  <p className="mt-[2px] text-[12px] font-light leading-[17px] text-black/60">{n.body}</p>
                  <p className="mt-[3px] text-[11px] font-light text-black/40">{ago(n.at)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <button onClick={close} className="pressable mt-4 h-[46px] rounded-btn bg-brand text-[16px] font-medium text-white">
        Done
      </button>
    </div>
  )
}
