/** "See All" – tüm işlemler, gün gün gruplu, filtrelenebilir (Figma'daki Transactions satır tasarımıyla) */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav, type ScreenProps } from '../../shell/navigation'
import { BackButton, ScreenLayout } from '../components/ScreenLayout'
import { openTxn, TxnRow } from '../components/TxnRow'
import { categoryById, money, TRANSACTIONS, when, type CategoryId, type Txn } from '../data/finance'
import { useFin } from '../store'

type Filter = 'all' | 'income' | 'expense'

export function Transactions({ params }: ScreenProps<{ filter?: Filter; category?: CategoryId; savings?: boolean; title?: string }>) {
  const nav = useNav()
  const [filter, setFilter] = useState<Filter>(params.filter ?? 'all')
  const deposits = useFin((s) => s.deposits)
  const source = params.savings ? deposits : TRANSACTIONS

  let list = source.filter((t) => (params.savings ? true : params.category ? t.category === params.category : filter === 'all' ? true : t.kind === filter))
  list = list.sort((a, b) => a.daysAgo - b.daysAgo || (a.minutesAgo ?? 0) - (b.minutesAgo ?? 0))

  const groups: { label: string; items: Txn[] }[] = []
  for (const t of list) {
    const label = t.daysAgo === 0 ? 'Today' : when(t)
    const g = groups.find((x) => x.label === label)
    if (g) g.items.push(t)
    else groups.push({ label, items: [t] })
  }
  const total = list.reduce((a, t) => a + t.amount, 0)

  return (
    <ScreenLayout>
      <div className="px-[40px] pt-[14px]">
        <BackButton onClick={nav.pop} />
        <h1 className="mt-[4px] text-[28px] font-medium text-navy">{params.title ?? (params.category ? categoryById(params.category).name : 'Transactions')}</h1>
        <p className="text-[13px] font-light text-black/55">
          This month · {list.length} transactions · {money(total, { sign: true })}
        </p>

        {!params.category && !params.savings && (
          <div className="relative mt-[18px] flex rounded-full border border-brand p-[3px]">
            {(['all', 'income', 'expense'] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className="relative z-10 h-[30px] flex-1 text-[13px] capitalize">
                {filter === f && <motion.span layoutId="txn-filter" className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                <span className={filter === f ? 'font-medium text-white' : 'font-light text-brand'}>{f}</span>
              </button>
            ))}
          </div>
        )}

        <div className="mt-[18px] flex flex-col gap-[18px] pb-6">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="mb-[6px] text-[12px] font-medium uppercase tracking-wide text-black/45">{g.label}</h2>
              <ul className="flex flex-col gap-[4px]">
                {g.items.map((t) => (
                  <li key={t.id}>
                    <TxnRow
                      t={t}
                      showSign
                      hideLogo={params.savings}
                      sub={t.category ? categoryById(t.category).name : t.kind === 'income' ? 'Income' : 'Moved to Pocket Goals'}
                      onPress={() => openTxn(nav, t)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </ScreenLayout>
  )
}
