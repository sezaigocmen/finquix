/** Figma: 4-dashboard – toplam bakiye + bağlı hesaplar, aylık harcama ve birikim grafikleri */
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { ScreenLayout } from '../components/ScreenLayout'
import { BarChart, InfoDot, PeriodPill } from '../components/Charts'
import { openDemoNotice } from '../components/DemoNotice'
import { ACCOUNTS, lastMonths, lastWeeks, money, SAVINGS_HISTORY, SAVINGS_WEEKLY, SPENDING_HISTORY, SPENDING_WEEKLY, TOTAL_BALANCE } from '../data/finance'
import garanti from '../../assets/bank-garanti.png'
import isbank from '../../assets/bank-isbank.png'

const LOGOS = { garanti, isbank }
type Period = 'Month' | 'Week'

const card = 'rounded-card border border-black bg-bg'

export function Dashboard() {
  const nav = useNav()
  const [open, setOpen] = useState<string | null>(null)
  const [spendP, setSpendP] = useState<Period>('Month')
  const [saveP, setSaveP] = useState<Period>('Month')

  const info = (title: string, text: string) => openDemoNotice(nav, title, text)

  return (
    <ScreenLayout>
      <div className="flex flex-col gap-[33px] px-[47px] pt-[46px]">
        {/* Total Balance */}
        <section className={`${card} px-[10px] pb-[14px] pt-[10px]`}>
          <p className="flex items-center gap-[6px] text-[15px] font-light">
            Total Balance <InfoDot onClick={() => info('Total Balance', 'The combined balance of all bank accounts you’ve connected to FinQuix, updated in real time.')} />
          </p>
          <p className="mt-[2px] text-[32px] font-semibold leading-[44px]">{money(TOTAL_BALANCE)}</p>

          <ul className="mt-[24px] flex flex-col gap-[10px]">
            {ACCOUNTS.map((a) => {
              const on = open === a.id
              return (
                <li key={a.id}>
                  <button onClick={() => setOpen(on ? null : a.id)} className="pressable flex w-full items-center gap-[7px] text-left" aria-expanded={on}>
                    <img src={LOGOS[a.id]} alt="" className="h-[31px] w-[31px] rounded-full object-cover" />
                    <span className="flex-1 text-[15px]">{a.bank}</span>
                    <span className="text-[15px] font-extralight tracking-[0.5px]">{a.mask}</span>
                    <motion.svg width="9" height="5" viewBox="0 0 9 5" fill="none" animate={{ rotate: on ? 180 : 0 }} aria-hidden>
                      <path d="M.5.5l4 4 4-4" stroke="#000" strokeOpacity=".5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="ml-[38px] mt-[6px] flex items-baseline justify-between rounded-[8px] bg-black/[0.04] px-[10px] py-[6px]">
                          <span className="text-[12px] font-light text-black/60">{a.type}</span>
                          <span className="text-[15px] font-medium">{money(a.balance)}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Total Spending */}
        <section className={`${card} px-[10px] pb-[10px] pt-[10px]`}>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-[6px] text-[15px] font-light">
              Total Spending <InfoDot onClick={() => info('Total Spending', 'Everything you spent across all accounts. Tap a bar to see that period’s total.')} />
            </p>
            <PeriodPill value={spendP} onClick={() => setSpendP(spendP === 'Month' ? 'Week' : 'Month')} />
          </div>
          <div className="mt-[8px]">
            <BarChart
              key={spendP}
              values={spendP === 'Month' ? SPENDING_HISTORY : SPENDING_WEEKLY}
              labels={spendP === 'Month' ? lastMonths(10) : lastWeeks(10)}
              color="#144473"
              format={(v) => money(v, { cents: false })}
              height={104}
            />
          </div>
        </section>

        {/* Total Savings */}
        <section className={`${card} px-[10px] pb-[10px] pt-[10px]`}>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-[6px] text-[15px] font-light">
              Total Savings <InfoDot onClick={() => info('Total Savings', 'Money you moved into your Pocket Goals. Small, steady amounts add up!')} />
            </p>
            <PeriodPill value={saveP} onClick={() => setSaveP(saveP === 'Month' ? 'Week' : 'Month')} />
          </div>
          <div className="mt-[8px]">
            <BarChart
              key={saveP}
              values={saveP === 'Month' ? SAVINGS_HISTORY : SAVINGS_WEEKLY}
              labels={saveP === 'Month' ? lastMonths(10) : lastWeeks(10)}
              color="#144748"
              format={(v) => money(v, { cents: false })}
              height={104}
            />
          </div>
        </section>
      </div>
      <div className="h-6" />
    </ScreenLayout>
  )
}
