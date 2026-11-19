/** Figma: 7-Hedefler – Pocket Goals: hedefler + ilerleme, Add Goals, birikim işlemleri */
import { motion } from 'motion/react'
import { useState } from 'react'
import { useNav } from '../../shell/navigation'
import { toast } from '../../shell/toast'
import { ScreenLayout } from '../components/ScreenLayout'
import { openTxn, TxnRow } from '../components/TxnRow'
import { money } from '../data/finance'
import { goalTip, type Goal } from '../data/goals'
import { useFin } from '../store'
import assistant from '../../assets/icons/assistant.svg'

/** Figma: Rectangle 43/44 – siyah çerçeveli ince çubuk, koyu yeşil dolum */
export function GoalBar({ pct, height = 9 }: { pct: number; height?: number }) {
  return (
    <div className="rounded-full border border-black p-px" style={{ height }}>
      <motion.div
        className="h-full rounded-full bg-brand"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(pct, 3))}%` }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      />
    </div>
  )
}

const fmt = (v: number) => money(v, { cents: false })

export function PocketGoals() {
  const nav = useNav()
  const goals = useFin((s) => s.goals)
  const deposits = useFin((s) => s.deposits)
  const tipGoal = goals.find((g) => g.id === 'summer') ?? goals[0]

  return (
    <ScreenLayout>
      <div className="px-[40px] pt-[54px]">
        <h1 className="text-center text-[32px] font-medium text-navy">Pocket Goals</h1>

        <ul className="mt-[40px] flex flex-col gap-[20px]">
          {goals.map((g) => (
            <li key={g.id}>
              <button onClick={() => openGoal(nav, g.id)} className="pressable block w-full text-left">
                <span className="flex items-baseline justify-between">
                  <span className="text-[20px] font-light leading-[28px]">{g.name}</span>
                  <span className="text-[15px] font-light">
                    {fmt(g.saved)} | {fmt(g.target)}
                  </span>
                </span>
                <span className="mt-[2px] block">
                  <GoalBar pct={(g.saved / g.target) * 100} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Add Goals */}
        <button onClick={() => openAddGoal(nav)} aria-label="Add goal" className="pressable mt-[34px] flex h-[15px] w-full items-center justify-center rounded-full border border-black bg-navy">
          <svg width="15" height="9" viewBox="0 0 15 9" aria-hidden>
            <path d="M0 4.5h15M7.5 0v9" stroke="#fff" />
          </svg>
        </button>
        <p className="mt-[3px] text-right text-[11px] font-light">Add Goals</p>

        {/* AI ipucu (vaka çalışmasındaki "AI Insights" özelliği) */}
        {tipGoal && (
          <div className="mt-[18px] flex items-start gap-[10px] rounded-card border border-brand/30 bg-brand/[0.04] px-[12px] py-[10px]">
            <img src={assistant} alt="" className="mt-[1px] h-[22px] w-[25px] shrink-0" />
            <p className="text-[12px] font-light leading-[17px] text-brand">{goalTip(tipGoal)}</p>
          </div>
        )}

        {/* Transactions */}
        <div className="mt-[34px] flex items-center justify-between">
          <h2 className="text-[15px]">Transactions</h2>
          <button onClick={() => nav.push('transactions', { savings: true, title: 'Savings' })} className="pressable text-[11px] font-light">
            See All
          </button>
        </div>
        <ul className="mt-[10px] flex flex-col gap-[2px] pb-6">
          {deposits.slice(0, 4).map((t) => (
            <li key={t.id}>
              <TxnRow t={t} hideLogo onPress={() => openTxn(nav, t)} />
            </li>
          ))}
        </ul>
      </div>
    </ScreenLayout>
  )
}

/* ───────── Hedef detayı + para ekleme ───────── */

function GoalSheet({ id, close }: { id: string; close: () => void }) {
  const g = useFin((s) => s.goals.find((x) => x.id === id))
  const addToGoal = useFin((s) => s.addToGoal)
  const removeGoal = useFin((s) => s.removeGoal)
  if (!g) return null
  const pct = Math.round((g.saved / g.target) * 100)
  const done = g.saved >= g.target
  const left = g.target - g.saved

  const add = (amount: number) => {
    const a = Math.min(amount, left)
    addToGoal(g.id, a)
    toast(g.saved + a >= g.target ? `🎉 ${g.name} is fully funded!` : `${money(a, { cents: false })} added to ${g.name}`)
  }

  return (
    <div className="flex flex-col px-6 pb-7 pt-1">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[24px] font-medium text-navy">{g.name}</h2>
        <span className="text-[15px] font-light">{pct}%</span>
      </div>
      <p className="mt-1 text-[32px] font-semibold leading-[40px]">
        {fmt(g.saved)} <span className="text-[16px] font-light text-black/50">of {fmt(g.target)}</span>
      </p>
      <div className="mt-3">
        <GoalBar pct={pct} height={12} />
      </div>
      <p className="mt-2 text-[13px] font-light text-black/55">{done ? 'Goal reached — great work!' : `${fmt(left)} to go`}</p>

      <div className="mt-4 flex items-start gap-[10px] rounded-card bg-brand/[0.05] px-[12px] py-[10px]">
        <img src={assistant} alt="" className="h-[22px] w-[25px] shrink-0" />
        <p className="text-[13px] font-light leading-[18px] text-brand">{goalTip(g)}</p>
      </div>

      <p className="mt-5 text-[15px]">Add money</p>
      <div className="mt-2 grid grid-cols-3 gap-[8px]">
        {[25, 50, 100].map((a) => (
          <button key={a} disabled={done} onClick={() => add(a)} className="pressable h-[44px] rounded-btn border border-brand text-[16px] font-medium text-brand disabled:opacity-30">
            +${a}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] font-light text-black/45">From Garanti BBVA *****7486 · demo transfer</p>

      <div className="mt-5 flex justify-between">
        <button
          onClick={() => {
            removeGoal(g.id)
            toast(`${g.name} removed`)
            close()
          }}
          className="pressable text-[13px] font-light text-expense"
        >
          Delete goal
        </button>
        <button onClick={close} className="pressable text-[13px] font-medium text-brand">
          Done
        </button>
      </div>
    </div>
  )
}

export function openGoal(nav: ReturnType<typeof useNav>, id: string) {
  nav.openSheet((close) => <GoalSheet id={id} close={close} />)
}

/* ───────── Yeni hedef ───────── */

const PRESETS = [500, 1000, 2500, 5000]

function AddGoalSheet({ close }: { close: () => void }) {
  const addGoal = useFin((s) => s.addGoal)
  const [name, setName] = useState('')
  const [target, setTarget] = useState<number | null>(null)
  const valid = name.trim().length > 0 && !!target && target > 0

  return (
    <form
      className="flex flex-col px-6 pb-7 pt-1"
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid) return
        addGoal(name.trim(), target!)
        toast(`🎯 ${name.trim()} added to Pocket Goals`)
        close()
      }}
    >
      <h2 className="text-[24px] font-medium text-navy">New goal</h2>
      <label className="mt-4 text-[13px] font-medium text-brand">What are you saving for?</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={24}
        placeholder="e.g. New Laptop"
        className="mt-1 h-[46px] rounded-btn border border-brand px-[18px] text-[16px] font-light outline-none placeholder:text-black/30"
      />
      <label className="mt-4 text-[13px] font-medium text-brand">Target amount</label>
      <div className="mt-1 grid grid-cols-4 gap-[6px]">
        {PRESETS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => setTarget(p)}
            className={`pressable h-[40px] rounded-btn border text-[14px] ${target === p ? 'border-brand bg-brand font-medium text-white' : 'border-brand/40 font-light text-brand'}`}
          >
            ${p.toLocaleString('en-US')}
          </button>
        ))}
      </div>
      <input
        type="number"
        inputMode="numeric"
        placeholder="Or enter an amount"
        value={target && !PRESETS.includes(target) ? target : ''}
        onChange={(e) => setTarget(Math.min(1_000_000, Math.max(0, Number(e.target.value) || 0)) || null)}
        className="mt-2 h-[44px] rounded-btn border border-brand/40 px-[18px] text-[16px] font-light outline-none placeholder:text-black/30"
      />
      <button type="submit" disabled={!valid} className="pressable mt-5 h-[49px] rounded-btn bg-brand text-[20px] font-semibold text-white disabled:opacity-40">
        Create Goal
      </button>
    </form>
  )
}

export function openAddGoal(nav: ReturnType<typeof useNav>) {
  nav.openSheet((close) => <AddGoalSheet close={close} />)
}

export type { Goal }
