/** Figma: 9-Bütçe_2 – kategori ızgarası + son harcamalar */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { ScreenLayout } from '../components/ScreenLayout'
import { PeriodPill } from '../components/Charts'
import { categoryIcon, openTxn, TxnRow } from '../components/TxnRow'
import { TRANSACTIONS } from '../data/finance'
import { useBudget, type Period } from './budgetData'
import warning from '../../assets/icons/warning.svg'

export function Budget() {
  const nav = useNav()
  const [period, setPeriod] = useState<Period>('Month')
  const rows = useBudget(period)
  const alerts = rows.filter((r) => r.alarmHit)
  const recent = TRANSACTIONS.filter((t) => t.kind === 'expense')
    .sort((a, b) => a.daysAgo - b.daysAgo || (a.minutesAgo ?? 0) - (b.minutesAgo ?? 0))
    .slice(0, 4)

  return (
    <ScreenLayout>
      <div className="px-[40px] pt-[54px]">
        <h1 className="text-[32px] font-medium leading-[48px] text-navy">Budget</h1>
        <p className="mt-[8px] text-[13px] font-light italic text-brand">Control your spending, set your limits..</p>

        <div className="mt-[30px] flex justify-end">
          <PeriodPill value={period} onClick={() => setPeriod(period === 'Month' ? 'Week' : 'Month')} />
        </div>

        {/* Alarm uyarısı */}
        {alerts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => nav.push('budget-category', { id: alerts[0].id })}
            className="pressable mt-[12px] flex w-full items-center gap-[10px] rounded-card border border-expense/40 bg-expense/[0.05] px-[12px] py-[8px] text-left"
          >
            <img src={warning} alt="" className="h-[14px] w-[15px] shrink-0" />
            <span className="text-[12px] font-light leading-[16px] text-expense">
              {alerts.length === 1
                ? `${alerts[0].name} reached its alarm — ${Math.round(alerts[0].pct)}% of the limit used.`
                : `${alerts.length} categories reached their alarm: ${alerts.map((a) => a.name).join(', ')}.`}
            </span>
          </motion.button>
        )}

        {/* Kategori ızgarası */}
        <div className="mt-[18px] grid grid-cols-3 gap-x-[26px] gap-y-[34px]">
          {rows.map((r) => (
            <button
              key={r.id}
              onClick={() => nav.push('budget-category', { id: r.id })}
              className={`pressable relative flex h-[108px] flex-col items-center rounded-card border pt-[12px] ${r.alarmHit ? 'border-expense' : 'border-brand'}`}
            >
              {r.alarmHit && <img src={warning} alt="Alarm" className="absolute right-[6px] top-[6px] h-[10px] w-[11px]" />}
              <img src={categoryIcon(r.id)} alt="" className="h-[38px] w-[38px]" />
              <span className="mt-[6px] text-[12px] leading-[16px]">{r.name}</span>
              <span className="mt-[6px] block h-[6px] w-[73px] overflow-hidden rounded-[3.5px] border border-black/50">
                <motion.span
                  className="block h-full rounded-[3.5px]"
                  style={{ background: r.over ? '#BA0808' : r.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, r.pct)}%` }}
                  transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                />
              </span>
              <span className="mt-[4px] text-[11px] font-extralight leading-none">
                ${r.spent} / ${r.limit}
              </span>
            </button>
          ))}
        </div>

        {/* History Transactions */}
        <div className="mt-[46px] flex items-center justify-between">
          <h2 className="text-[15px]">History Transactions</h2>
          <button onClick={() => nav.push('transactions', { filter: 'expense' })} className="pressable text-[11px] font-light">
            See All
          </button>
        </div>
        <ul className="mt-[10px] flex flex-col gap-[4px] pb-6">
          {recent.map((t) => (
            <li key={t.id}>
              <TxnRow t={{ ...t, logo: undefined }} onPress={() => openTxn(nav, t)} />
            </li>
          ))}
        </ul>
      </div>
    </ScreenLayout>
  )
}
