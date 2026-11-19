/**
 * Uygulama verisi: tarayıcı hafızasında (localStorage) saklanır.
 * Demo verisiyle başlar. Gerçek banka ya da kişisel bilgi toplanmaz.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEPOSITS_SEED, GOALS_SEED, type Goal } from './data/goals'
import { CATEGORIES, categoryById, type Account, type CategoryId, type Txn } from './data/finance'
import { NOTIFS_SEED, type Notif } from './data/notifications'

const STORAGE_KEY = 'finquix-demo-v1'

interface FinState {
  /** Giriş + banka bağlama tamamlandı mı */
  onboarded: boolean
  setOnboarded: (v: boolean) => void
  /** Pocket Goals */
  goals: Goal[]
  deposits: Txn[]
  addToGoal: (goalId: string, amount: number, account?: Account['id']) => void
  addGoal: (name: string, target: number) => void
  removeGoal: (goalId: string) => void
  /** Budget: kategori limitleri ve alarm eşikleri ($) */
  limits: Record<CategoryId, number>
  alarms: Partial<Record<CategoryId, number>>
  setLimit: (id: CategoryId, v: number) => void
  setAlarm: (id: CategoryId, v: number | null) => void
  /** Bildirim kutusu */
  notifs: Notif[]
  notify: (n: Omit<Notif, 'id' | 'at' | 'read'>) => void
  markAllRead: () => void
  clearNotifs: () => void
  /** Profil > tercihler (demo) */
  prefs: Prefs
  setPref: (k: keyof Prefs, v: boolean) => void
}

type Prefs = { push: boolean; monthlyReport: boolean; faceId: boolean }

export const useFin = create<FinState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      setOnboarded: (onboarded) => set({ onboarded }),
      goals: GOALS_SEED,
      deposits: DEPOSITS_SEED,
      addToGoal: (goalId, amount, account = 'garanti') => {
        const g = get().goals.find((x) => x.id === goalId)
        if (!g) return
        set((s) => ({
          goals: s.goals.map((x) => (x.id === goalId ? { ...x, saved: Math.min(x.target, x.saved + amount) } : x)),
          deposits: [{ id: `d${Date.now()}`, title: g.name, goal: goalId, amount, kind: 'saving', account, daysAgo: 0, minutesAgo: 0 }, ...s.deposits],
        }))
        const saved = Math.min(g.target, g.saved + amount)
        get().notify(
          saved >= g.target
            ? { kind: 'goal', title: `${g.name} is fully funded 🎉`, body: `You reached your $${g.target.toLocaleString('en-US')} goal.` }
            : { kind: 'goal', title: `+$${amount} added to ${g.name}`, body: `${Math.round((saved / g.target) * 100)}% done — $${(g.target - saved).toLocaleString('en-US')} to go.` },
        )
      },
      addGoal: (name, target) => set((s) => ({ goals: [...s.goals, { id: `g${Date.now()}`, name, saved: 0, target }] })),
      removeGoal: (goalId) => set((s) => ({ goals: s.goals.filter((g) => g.id !== goalId) })),
      limits: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.limit])) as Record<CategoryId, number>,
      // Figma: Subscriptions için $400'de alarm; Food (persona: dışarıda yeme) %90'da
      alarms: { subscriptions: 400, food: 360 },
      setLimit: (id, v) => {
        set((s) => ({ limits: { ...s.limits, [id]: v } }))
        get().notify({ kind: 'budget', title: `${categoryById(id).name} limit updated`, body: `Your monthly limit is now $${v}.` })
      },
      setAlarm: (id, v) => {
        set((s) => {
          const alarms = { ...s.alarms }
          if (v === null) delete alarms[id]
          else alarms[id] = v
          return { alarms }
        })
        const name = categoryById(id).name
        get().notify(
          v === null
            ? { kind: 'budget', title: `${name} alarm turned off`, body: 'You won’t get alerts for this category.' }
            : { kind: 'alarm', title: `${name} alarm set at $${v}`, body: 'We’ll alert you when spending reaches this amount.' },
        )
      },
      notifs: NOTIFS_SEED,
      notify: (n) => set((s) => ({ notifs: [{ ...n, id: `n${Date.now()}`, at: Date.now(), read: false }, ...s.notifs].slice(0, 30) })),
      markAllRead: () => set((s) => ({ notifs: s.notifs.map((n) => (n.read ? n : { ...n, read: true })) })),
      clearNotifs: () => set({ notifs: [] }),
      prefs: { push: true, monthlyReport: true, faceId: false },
      setPref: (k, v) => set((s) => ({ prefs: { ...s.prefs, [k]: v } })),
    }),
    { name: STORAGE_KEY },
  ),
)

/** Demoyu ilk haline döndürür. */
export function resetDemo() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* gizli sekme vb. */
  }
  window.location.reload()
}
