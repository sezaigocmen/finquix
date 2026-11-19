/** Figma: 5-Analiz_1 (Income) ve 6-Analiz_2 (Expense) */
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNav } from '../../shell/navigation'
import { ScreenLayout } from '../components/ScreenLayout'
import { PeriodPill } from '../components/Charts'
import { Donut, type Slice } from '../components/Donut'
import { openTxn, TxnRow } from '../components/TxnRow'
import { CATEGORIES, INCOME_SOURCES, inPeriod, money, TRANSACTIONS } from '../data/finance'

type Tab = 'income' | 'expense'
type Period = 'Month' | 'Week'

export function Analysis() {
  const nav = useNav()
  const [tab, setTab] = useState<Tab>('income')
  const [period, setPeriod] = useState<Period>('Month')
  const [sel, setSel] = useState<string | null>(null)

  const txns = useMemo(() => inPeriod(TRANSACTIONS, period).filter((t) => t.kind === tab), [tab, period])
  const total = txns.reduce((a, t) => a + Math.abs(t.amount), 0)

  const slices: Slice[] =
    tab === 'income'
      ? INCOME_SOURCES.map((s) => ({ id: s.id, label: s.name, color: s.color, value: txns.filter((t) => t.source === s.id).reduce((a, t) => a + t.amount, 0) }))
      : CATEGORIES.map((c) => ({ id: c.id, label: c.name, color: c.color, value: txns.filter((t) => t.category === c.id).reduce((a, t) => a - t.amount, 0) }))
  const visible = slices.filter((s) => s.value > 0)
  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0)
  const selSlice = visible.find((s) => s.id === sel)

  const recent = [...txns].sort((a, b) => a.daysAgo - b.daysAgo || (a.minutesAgo ?? 0) - (b.minutesAgo ?? 0)).slice(0, 4)
  const isIncome = tab === 'income'

  const switchTab = (t: Tab) => {
    setTab(t)
    setSel(null)
  }

  return (
    <ScreenLayout>
      <div className="px-[40px] pt-[44px]">
        {/* Income / Expense */}
        <div className="relative flex">
          {(['income', 'expense'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`pressable flex-1 pb-[16px] text-[15px] transition-colors ${tab === t ? 'font-medium text-navy' : 'font-light text-ink'}`}
            >
              {t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
          <span className="absolute inset-x-0 bottom-0 h-px bg-ink" />
          <motion.span
            className="absolute bottom-[-0.5px] h-[2px] w-1/2"
            animate={{ left: isIncome ? '0%' : '50%', backgroundColor: isIncome ? '#51A84E' : '#CC3030' }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, x: isIncome ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
            {/* Toplam */}
            <div className="mt-[40px] flex items-center justify-between">
              <h2 className="text-[15px]">{isIncome ? 'Income Analysis' : 'Expense Analysis'}</h2>
              <PeriodPill value={period} onClick={() => setPeriod(period === 'Month' ? 'Week' : 'Month')} />
            </div>
            <p className={`mt-[2px] text-[32px] font-semibold leading-[44px] ${isIncome ? 'text-income' : 'text-expense'}`}>{money(total)}</p>

            {/* Kategori halkası */}
            <h2 className="mt-[44px] text-[15px]">{isIncome ? 'Income Category' : 'Expense Category'}</h2>
            <div className="mt-[16px] flex items-center gap-[16px]">
              <Donut
                slices={visible}
                selected={sel}
                onSelect={setSel}
                center={
                  selSlice ? (
                    <span className="flex flex-col">
                      <span className="text-[11px] font-extralight leading-[13px]">{selSlice.label}</span>
                      <span className="text-[16px] font-medium leading-[20px]">{money(selSlice.value, { cents: false })}</span>
                      <span className="text-[11px] font-extralight leading-[13px]">{pct(selSlice.value)}%</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-extralight leading-[15px]">
                      100% Data
                      <br />
                      Recorded
                    </span>
                  )
                }
              />
              <ul className="flex min-w-0 flex-1 flex-col gap-[9px]">
                {visible.map((s) => (
                  <li key={s.id}>
                    <button onClick={() => setSel(sel === s.id ? null : s.id)} className={`pressable flex w-full items-center gap-[7px] text-left transition-opacity ${sel && sel !== s.id ? 'opacity-40' : ''}`}>
                      <span className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: s.color }} />
                      <span className="min-w-0 flex-1 truncate text-[11px] font-extralight">
                        {s.label} ({pct(s.value)}%)
                      </span>
                      <span className="text-[11px]">{money(s.value, { cents: !Number.isInteger(s.value) })}</span>
                    </button>
                  </li>
                ))}
                {visible.length === 0 && <li className="text-[12px] font-extralight text-black/50">No {tab} this week.</li>}
              </ul>
            </div>

            {/* İşlemler */}
            <div className="mt-[52px] flex items-center justify-between">
              <h2 className="text-[15px]">Transactions</h2>
              <button onClick={() => nav.push('transactions', { filter: tab })} className="pressable text-[11px] font-light">
                See All
              </button>
            </div>
            <ul className="mt-[10px] flex flex-col gap-[4px]">
              {recent.map((t) => (
                <li key={t.id}>
                  <TxnRow t={t} onPress={() => openTxn(nav, t)} />
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="h-6" />
    </ScreenLayout>
  )
}
