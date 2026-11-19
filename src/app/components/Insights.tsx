/**
 * Öneri: AI Insights – asistan ikonundan açılır.
 * Gerçek yapay zeka yok: öneriler demo verisinden hesaplanır, sorular hazır cevaplıdır.
 */
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { NavApi } from '../../shell/navigation'
import { useBudget } from '../budget/budgetData'
import { SAVINGS_HISTORY, SPENDING_HISTORY, TOTAL_BALANCE, TRANSACTIONS, money } from '../data/finance'
import { goalTip } from '../data/goals'
import { useFin } from '../store'
import assistant from '../../assets/icons/assistant.svg'

export function openInsights(nav: NavApi) {
  nav.openSheet((close) => <InsightsSheet nav={nav} close={close} />)
}

type Insight = { tone: 'warn' | 'good' | 'info'; title: string; text: string; action?: { label: string; run: () => void } }

const TONE = {
  warn: { bar: '#BA0808', bg: '#BA08080D' },
  good: { bar: '#2E7C2C', bg: '#2E7C2C0D' },
  info: { bar: '#1346C7', bg: '#1346C70D' },
}

function InsightsSheet({ nav, close }: { nav: NavApi; close: () => void }) {
  const budget = useBudget('Month')
  const goals = useFin((s) => s.goals)
  const [asked, setAsked] = useState<number | null>(null)

  const go = (screen: string, params?: Record<string, unknown>) => {
    close()
    setTimeout(() => nav.push(screen, params), 250)
  }

  /* Hesaplanan öneriler */
  const hot = budget.filter((r) => r.pct >= 90).sort((a, b) => b.pct - a.pct).slice(0, 2)
  const [prev, cur] = SPENDING_HISTORY.slice(-2)
  const diff = Math.round(((prev - cur) / prev) * 100)
  const subs = TRANSACTIONS.filter((t) => t.category === 'subscriptions')
  const subsTotal = -subs.reduce((a, t) => a + t.amount, 0)
  const biggest = subs.reduce((a, t) => (t.amount < a.amount ? t : a))
  const avgSaving = Math.round(SAVINGS_HISTORY.slice(-3).reduce((a, b) => a + b, 0) / 3)
  const goal = goals.find((g) => g.saved < g.target) ?? goals[0]
  const left = goal ? goal.target - goal.saved : 0
  const months = Math.max(1, Math.ceil(left / avgSaving))
  const budgetLeft = budget.reduce((a, r) => a + Math.max(0, r.remaining), 0)

  const insights: Insight[] = [
    ...hot.map<Insight>((r) => ({
      tone: 'warn',
      title: `${r.name} is at ${Math.round(r.pct)}% of its limit`,
      text: `Only ${money(Math.max(0, r.remaining), { cents: false })} left for ${r.name} this month. Try to keep the rest of the month light here.`,
      action: { label: `Open ${r.name} budget`, run: () => go('budget-category', { id: r.id }) },
    })),
    {
      tone: diff >= 0 ? 'good' : 'warn',
      title: diff >= 0 ? `You spent ${diff}% less than last month` : `You spent ${-diff}% more than last month`,
      text: `${money(cur, { cents: false })} this month vs ${money(prev, { cents: false })} before. ${diff >= 0 ? `That’s ${money(prev - cur, { cents: false })} you could move to a goal.` : 'Check which category grew the most.'}`,
      action: { label: 'See spending analysis', run: () => (close(), setTimeout(() => nav.setTab('analysis'), 250)) },
    },
    {
      tone: 'info',
      title: `${subs.length} subscriptions · ${money(subsTotal, { cents: false })}/month`,
      text: `${biggest.title} (${money(-biggest.amount, { cents: false })}) is the biggest one. Do you still use all of them?`,
      action: { label: 'Review subscriptions', run: () => go('transactions', { category: 'subscriptions' }) },
    },
    ...(goal
      ? [
          {
            tone: 'good' as const,
            title: `${goal.name}: about ${months} month${months > 1 ? 's' : ''} to go`,
            text: `At your average saving pace (${money(avgSaving, { cents: false })}/month) you’ll reach ${money(goal.target, { cents: false })}. ${goalTip(goal)}`,
            action: { label: 'Open Pocket Goals', run: () => (close(), setTimeout(() => nav.setTab('goals'), 250)) },
          },
        ]
      : []),
  ]

  /* Hazır sorular */
  const qa = [
    {
      q: 'Can I afford a $200 purchase?',
      a: `Yes, but plan it. You have ${money(TOTAL_BALANCE)} across your accounts and ${money(budgetLeft, { cents: false })} left in this month’s budgets. ${hot.length ? `Avoid ${hot.map((r) => r.name).join(' and ')} — ${hot.length > 1 ? 'they’re' : 'it’s'} almost at the limit.` : ''} Waiting until your next salary keeps your goals on track.`,
    },
    {
      q: 'Where can I cut spending?',
      a: `Food and Subscriptions are your most flexible costs. Cooking at home twice more a week and pausing ${biggest.title} would free up about $150 a month.`,
    },
    {
      q: 'How do I reach my goals faster?',
      a: goal ? `Automate a weekly transfer on payday. Adding just $25 a week to ${goal.name} gets you there ${months > 2 ? 'about a month' : 'a few weeks'} sooner.` : 'Create a goal first — then I can suggest a saving plan.',
    },
  ]

  return (
    <div className="flex flex-col px-5 pb-6 pt-1">
      <div className="flex items-center gap-3">
        <span className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-bar">
          <img src={assistant} alt="" className="h-[29px] w-[33px]" />
        </span>
        <div>
          <h2 className="text-[20px] font-medium leading-[26px] text-navy">AI Insights</h2>
          <p className="text-[12px] font-light text-black/50">Based on this month’s activity</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-col gap-[10px]">
        {insights.map((it, i) => (
          <motion.li
            key={it.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.3 }}
            className="overflow-hidden rounded-card border-l-[3px] px-[14px] py-[11px]"
            style={{ borderColor: TONE[it.tone].bar, background: TONE[it.tone].bg }}
          >
            <p className="text-[14px] font-medium leading-[19px]">{it.title}</p>
            <p className="mt-[3px] text-[12px] font-light leading-[17px] text-black/65">{it.text}</p>
            {it.action && (
              <button onClick={it.action.run} className="pressable mt-[6px] text-[12px] font-medium text-brand">
                {it.action.label} →
              </button>
            )}
          </motion.li>
        ))}
      </ul>

      <h3 className="mt-5 text-[15px] font-medium">Ask FinQuix</h3>
      <div className="mt-2 flex flex-wrap gap-[6px]">
        {qa.map((x, i) => (
          <button
            key={x.q}
            onClick={() => setAsked(i)}
            className={`pressable rounded-pill border px-[12px] py-[6px] text-[12px] ${asked === i ? 'border-brand bg-brand text-white' : 'border-brand/40 text-brand'}`}
          >
            {x.q}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {asked !== null && (
          <motion.div key={asked} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 flex flex-col gap-2">
            <p className="self-end rounded-[16px] rounded-br-[4px] bg-brand px-[12px] py-[8px] text-[13px] text-white">{qa[asked].q}</p>
            <p className="self-start rounded-[16px] rounded-bl-[4px] bg-bar px-[12px] py-[8px] text-[13px] font-light leading-[19px]">{qa[asked].a}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-center text-[11px] font-light text-black/40">Demo insights from sample data · no real AI or bank access</p>
    </div>
  )
}
