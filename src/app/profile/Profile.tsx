/** Öneri: Profil – persona, özet, bağlı bankalar, tercihler (demo), demo yönetimi */
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { openConfirm } from '../components/Confirm'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout } from '../components/ScreenLayout'
import { openDemoNotice } from '../components/DemoNotice'
import { BANK_LOGO } from '../components/TxnRow'
import { ACCOUNTS, TOTAL_BALANCE, money } from '../data/finance'
import { resetDemo, useFin } from '../store'
import avatar from '../../assets/avatar-lucas.jpg'

const card = 'rounded-card border border-black/15'

export function Profile() {
  const nav = useNav()
  const goals = useFin((s) => s.goals)
  const deposits = useFin((s) => s.deposits)
  const prefs = useFin((s) => s.prefs)
  const setPref = useFin((s) => s.setPref)
  const setOnboarded = useFin((s) => s.setOnboarded)
  const confirmReset = () =>
    openConfirm({ title: 'Restart the demo?', message: 'Goals, limits, alarms and notifications go back to the sample data.', confirm: 'Restart', onConfirm: resetDemo })
  const confirmLogout = () =>
    openConfirm({ title: 'Log out?', message: 'You’ll return to the sign-in screen. Your demo data stays on this device.', confirm: 'Log out', onConfirm: () => setOnboarded(false) })
  const saved = deposits.reduce((a, d) => a + d.amount, 0)
  const active = goals.filter((g) => g.saved < g.target).length

  const toggle = (k: keyof typeof prefs, on: string, off: string) => {
    setPref(k, !prefs[k])
    toast(!prefs[k] ? on : off)
  }

  return (
    <ScreenLayout>
      <div className="px-[28px] pt-[26px]">
        {/* Kişi */}
        <div className="flex flex-col items-center text-center">
          <img src={avatar} alt="" className="h-[88px] w-[88px] rounded-full border-2 border-brand object-cover" />
          <h1 className="mt-3 text-[24px] font-medium leading-[30px] text-navy">Lucas Mores</h1>
          <p className="text-[13px] font-light text-black/55">Marketing Manager · San Diego</p>
          <span className="mt-2 rounded-pill bg-brand/[0.08] px-3 py-[3px] text-[11px] font-medium text-brand">Member since 2025</span>
        </div>

        {/* Özet */}
        <div className="mt-5 grid grid-cols-3 gap-[8px]">
          <Stat label="Balance" value={money(TOTAL_BALANCE, { cents: false })} />
          <Stat label="Saved this month" value={money(saved, { cents: false })} />
          <Stat label="Active goals" value={String(active)} onClick={() => nav.setTab('goals')} />
        </div>

        {/* Bankalar */}
        <Section title="Connected banks">
          <div className={card}>
            {ACCOUNTS.map((a, i) => (
              <div key={a.id} className={`flex items-center gap-3 px-[14px] py-[11px] ${i ? 'border-t border-black/10' : ''}`}>
                <img src={BANK_LOGO[a.id]} alt="" className="h-[34px] w-[34px] rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium leading-[18px]">{a.bank}</p>
                  <p className="text-[11px] font-light text-black/50">
                    {a.type} · {a.mask}
                  </p>
                </div>
                <span className="text-[14px] font-medium">{money(a.balance)}</span>
              </div>
            ))}
            <button
              onClick={() => openDemoNotice(nav, 'Connect another bank', 'In the real app you could link any supported bank through a secure open-banking connection. This demo uses two sample accounts.')}
              className="pressable flex w-full items-center gap-3 border-t border-black/10 px-[14px] py-[12px] text-left text-[14px] text-brand"
            >
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-dashed border-brand text-[20px] font-light">+</span>
              Connect another bank
            </button>
          </div>
        </Section>

        {/* Tercihler */}
        <Section title="Preferences">
          <div className={card}>
            <Row label="Push notifications" sub="Budget alarms and goal updates">
              <Switch on={prefs.push} onClick={() => toggle('push', 'Notifications on', 'Notifications off')} />
            </Row>
            <Row label="Monthly report" sub="A summary on the 1st of each month" border>
              <Switch on={prefs.monthlyReport} onClick={() => toggle('monthlyReport', 'Monthly report on', 'Monthly report off')} />
            </Row>
            <Row label="Face ID" sub="Unlock FinQuix securely" border>
              <Switch on={prefs.faceId} onClick={() => toggle('faceId', 'Face ID on (demo)', 'Face ID off')} />
            </Row>
            <Row label="Currency" border onClick={() => openDemoNotice(nav, 'Currency', 'The demo uses US dollars. Multi-currency support is planned for the full app.')}>
              <span className="text-[13px] font-light text-black/55">USD ($) ›</span>
            </Row>
          </div>
        </Section>

        {/* Demo */}
        <Section title="About">
          <div className={card}>
            <Row label="About this demo" onClick={() => openDemoNotice(nav, 'About this demo')}>
              <span className="text-black/35">›</span>
            </Row>
            <a href="https://www.sezaigocmen.com/projects/finquix" target="_blank" rel="noreferrer" className="pressable flex items-center justify-between border-t border-black/10 px-[14px] py-[13px]">
              <span className="text-[14px]">Full case study</span>
              <span className="text-black/35">↗</span>
            </a>
            <Row label="Restart demo" border onClick={confirmReset}>
              <span className="text-black/35">↺</span>
            </Row>
          </div>
        </Section>

        <button onClick={confirmLogout} className="pressable mt-5 h-[46px] w-full rounded-btn border border-expense text-[15px] font-medium text-expense">
          Log out
        </button>
        <p className="mt-3 pb-6 text-center text-[11px] font-light text-black/40">FinQuix demo · v1.0 · Sample data only</p>
      </div>
    </ScreenLayout>
  )
}

function Stat({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={!onClick} className={`flex h-[64px] flex-col items-center justify-center ${card} ${onClick ? 'pressable' : ''}`}>
      <span className="text-[16px] font-semibold text-navy">{value}</span>
      <span className="mt-[2px] text-[11px] font-light text-black/55">{label}</span>
    </button>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[15px] font-medium">{title}</h2>
      {children}
    </section>
  )
}

function Row({ label, sub, border, onClick, children }: { label: string; sub?: string; border?: boolean; onClick?: () => void; children?: ReactNode }) {
  const cls = `flex w-full items-center justify-between gap-3 px-[14px] py-[11px] text-left ${border ? 'border-t border-black/10' : ''}`
  const body = (
    <>
      <span className="min-w-0">
        <span className="block text-[14px] leading-[19px]">{label}</span>
        {sub && <span className="block text-[11px] font-light text-black/50">{sub}</span>}
      </span>
      {children}
    </>
  )
  return onClick ? (
    <button onClick={onClick} className={`pressable ${cls}`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  )
}

function Switch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={onClick} className={`relative h-[28px] w-[48px] shrink-0 rounded-full transition-colors ${on ? 'bg-brand' : 'bg-black/20'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 35 }} className={`absolute top-[2px] h-[24px] w-[24px] rounded-full bg-white shadow ${on ? 'right-[2px]' : 'left-[2px]'}`} />
    </button>
  )
}
