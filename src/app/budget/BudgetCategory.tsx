/** Figma: 9-Bütçe – kategori detayı: limit çubuğu, 6 bilgi kutusu, Create Alarm, kategori işlemleri */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav, type ScreenProps } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { BackButton, ScreenLayout } from '../components/ScreenLayout'
import { PeriodPill } from '../components/Charts'
import { categoryIcon, openTxn, TxnRow } from '../components/TxnRow'
import { TRANSACTIONS, type CategoryId } from '../data/finance'
import { useFin } from '../store'
import { useBudget, type Period } from './budgetData'
import warning from '../../assets/icons/warning.svg'
import alarmIcon from '../../assets/icons/alarm.svg'

const box = 'flex h-[70px] flex-col items-center justify-center rounded-card border border-black/50 px-1 text-center'

export function BudgetCategory({ params }: ScreenProps<{ id: CategoryId }>) {
  const nav = useNav()
  const [period, setPeriod] = useState<Period>('Month')
  const row = useBudget(period).find((r) => r.id === params.id)!
  const monthly = useBudget('Month').find((r) => r.id === params.id)!
  const setLimit = useFin((s) => s.setLimit)
  const setAlarm = useFin((s) => s.setAlarm)
  const txns = TRANSACTIONS.filter((t) => t.category === params.id).sort((a, b) => a.daysAgo - b.daysAgo || (a.minutesAgo ?? 0) - (b.minutesAgo ?? 0))
  const fillPct = Math.min(100, row.pct)

  /* Limit düzenleme */
  const editLimit = () =>
    nav.openSheet((close) => <LimitSheet name={row.name} value={monthly.limit} spent={monthly.spent} close={close} onSave={(v) => (setLimit(params.id, v), toast(`${row.name} limit set to $${v}`))} />)

  /* Alarm kurma */
  const editAlarm = () =>
    nav.openSheet((close) => (
      <div className="flex flex-col px-6 pb-7 pt-1">
        <div className="flex items-center gap-3">
          <span className="flex h-[44px] w-[44px] items-center justify-center rounded-card bg-expense">
            <img src={alarmIcon} alt="" className="h-[22px] w-[25px] brightness-0 invert" />
          </span>
          <div>
            <h2 className="text-[20px] font-medium text-navy">Limit alarm</h2>
            <p className="text-[13px] font-light text-black/55">Get a smart alert before you go over your {row.name} budget.</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-[8px]">
          {[75, 90, 100].map((p) => {
            const v = Math.round((monthly.limit * p) / 100)
            const on = monthly.alarm === v
            return (
              <button
                key={p}
                onClick={() => {
                  setAlarm(params.id, v)
                  toast(`🔔 Alarm set at $${v} (${p}%)`)
                  close()
                }}
                className={`pressable flex h-[58px] flex-col items-center justify-center rounded-card border ${on ? 'border-expense bg-expense text-white' : 'border-black/30'}`}
              >
                <span className="text-[16px] font-medium">{p}%</span>
                <span className={`text-[11px] font-light ${on ? 'text-white/80' : 'text-black/50'}`}>${v}</span>
              </button>
            )
          })}
        </div>
        {monthly.alarm !== undefined && (
          <button
            onClick={() => {
              setAlarm(params.id, null)
              toast('Alarm turned off')
              close()
            }}
            className="pressable mt-4 text-[13px] font-light text-expense"
          >
            Turn off alarm
          </button>
        )}
      </div>
    ))

  return (
    <ScreenLayout>
      <div className="px-[40px] pt-[14px]">
        <BackButton onClick={nav.pop} />
        <h1 className="mt-[2px] text-[32px] font-medium leading-[48px] text-navy">Budget</h1>
        <p className="mt-[8px] text-[13px] font-light italic text-brand">Control your spending, set your limits..</p>

        <div className="mt-[22px] flex justify-end">
          <PeriodPill value={period} onClick={() => setPeriod(period === 'Month' ? 'Week' : 'Month')} />
        </div>

        {/* Kategori kartı */}
        <section className={`mt-[14px] rounded-card border px-[11px] pb-[12px] pt-[10px] ${row.alarmHit ? 'border-expense' : 'border-brand'}`}>
          <div className="flex items-center gap-[6px]">
            <img src={categoryIcon(row.id)} alt="" className="h-[38px] w-[38px]" />
            <h2 className="text-[15px] font-medium">{row.name}</h2>
          </div>
          <div className="relative mt-[22px]">
            {row.alarm !== undefined && (
              <img
                src={warning}
                alt="Alarm"
                className="absolute -top-[13px] h-[10px] w-[11px] -translate-x-1/2"
                style={{ left: `${Math.min(100, (row.alarm / row.limit) * 100)}%` }}
              />
            )}
            <div className="h-[7px] overflow-hidden rounded-[3.5px] border border-black/50">
              <motion.div
                className="h-full rounded-[3.5px]"
                style={{ background: row.over ? '#BA0808' : row.color }}
                initial={{ width: 0 }}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
            <div className="relative mt-[2px] h-[15px] text-[11px] font-extralight">
              <span className="absolute left-0">$0</span>
              {fillPct > 12 && fillPct < 88 && (
                <span className="absolute -translate-x-1/2 font-normal" style={{ left: `${fillPct}%` }}>
                  ${row.spent}
                </span>
              )}
              <span className="absolute right-0">${row.limit}</span>
            </div>
          </div>
        </section>

        {/* Bilgi kutuları */}
        <div className="mt-[26px] grid grid-cols-4 gap-[11px]">
          <div className={box}>
            <span className="text-[11px] font-light leading-[13px]">Amount Spent</span>
            <span className="mt-[5px] text-[12px] font-medium">${row.spent}</span>
          </div>
          <button onClick={editLimit} className={`pressable ${box}`}>
            <span className="text-[11px] font-light leading-[13px]">Spending Limit</span>
            <span className="mt-[5px] text-[12px] font-medium underline decoration-dotted underline-offset-2">${row.limit}</span>
          </button>
          <div className={box}>
            <span className="text-[11px] font-light leading-[13px] opacity-70">Remaining</span>
            <span className={`mt-[5px] text-[12px] font-medium ${row.remaining < 0 ? 'text-expense' : ''}`}>{row.remaining < 0 ? `-$${-row.remaining}` : `$${row.remaining}`}</span>
          </div>
          <button onClick={editAlarm} className={`pressable ${box}`}>
            <span className="text-[11px] font-light leading-[13px]">Limit Alarm</span>
            <span className="mt-[5px] text-[12px] font-medium">{row.alarm !== undefined ? `$${row.alarm}` : 'Off'}</span>
          </button>
          <div className={box}>
            <span className="text-[11px] font-light leading-[13px]">Spending %</span>
            <span className={`mt-[5px] text-[12px] font-medium ${row.over ? 'text-expense' : ''}`}>{row.pct.toFixed(2)}%</span>
          </div>
          <button onClick={editAlarm} className="pressable flex h-[70px] flex-col items-center justify-center rounded-card bg-expense px-1 text-center text-white">
            <span className="text-[11px] font-light leading-[13px]">{row.alarm !== undefined ? 'Edit Alarm' : 'Create Alarm'}</span>
            <img src={alarmIcon} alt="" className="mt-[5px] h-[22px] w-[25px] brightness-0 invert" />
          </button>
        </div>

        {row.alarmHit && (
          <p className="mt-[14px] flex items-center gap-2 text-[12px] font-light text-expense">
            <img src={warning} alt="" className="h-[12px] w-[13px]" />
            Alarm reached — you’ve used {Math.round(row.pct)}% of this budget.
          </p>
        )}

        {/* Kategori işlemleri */}
        <div className="mt-[36px] flex items-center justify-between">
          <h2 className="text-[15px]">History Transactions</h2>
          <button onClick={() => nav.push('transactions', { category: params.id })} className="pressable text-[11px] font-light">
            See All
          </button>
        </div>
        <ul className="mt-[10px] flex flex-col gap-[4px] pb-6">
          {txns.slice(0, 4).map((t) => (
            <li key={t.id}>
              <TxnRow t={{ ...t, logo: undefined }} onPress={() => openTxn(nav, t)} />
            </li>
          ))}
        </ul>
      </div>
    </ScreenLayout>
  )
}

function LimitSheet({ name, value, spent, close, onSave }: { name: string; value: number; spent: number; close: () => void; onSave: (v: number) => void }) {
  const [v, setV] = useState(value)
  const step = (d: number) => setV(Math.max(50, Math.min(5000, v + d)))
  return (
    <div className="flex flex-col items-center px-6 pb-7 pt-1">
      <h2 className="self-start text-[20px] font-medium text-navy">{name} limit</h2>
      <p className="self-start text-[13px] font-light text-black/55">You’ve spent ${spent} this month.</p>
      <div className="mt-5 flex items-center gap-6">
        <button onClick={() => step(-50)} className="pressable flex h-[44px] w-[44px] items-center justify-center rounded-full border border-brand text-[24px] font-light text-brand">
          −
        </button>
        <span className="w-[120px] text-center text-[36px] font-semibold">${v}</span>
        <button onClick={() => step(50)} className="pressable flex h-[44px] w-[44px] items-center justify-center rounded-full border border-brand text-[24px] font-light text-brand">
          +
        </button>
      </div>
      <p className={`mt-2 text-[12px] font-light ${spent > v ? 'text-expense' : 'text-black/45'}`}>{spent > v ? `$${spent - v} over this limit` : `$${v - spent} left this month`}</p>
      <button
        onClick={() => {
          onSave(v)
          close()
        }}
        className="pressable mt-5 h-[49px] w-full rounded-btn bg-brand text-[20px] font-semibold text-white"
      >
        Save Limit
      </button>
    </div>
  )
}
